#include <napi.h>
#include "fingerprint.hpp"
#include <sstream>
#include <iomanip>

// Convert uint64_t to hex string
std::string uint64_to_hex(uint64_t value) {
    std::stringstream ss;
    ss << std::hex << std::uppercase << std::setfill('0') << std::setw(16) << value;
    return ss.str();
}

// Convert hex string to uint64_t
uint64_t hex_to_uint64(const std::string& hex) {
    uint64_t value;
    std::stringstream ss;
    ss << std::hex << hex;
    ss >> value;
    return value;
}

// Generate fingerprint and return as hex string
Napi::String FingerprintWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
        return Napi::String::New(env, "0000000000000000");
    }

    std::string input = info[0].As<Napi::String>().Utf8Value();
    uint64_t hash = ECE::Fingerprint::Generate(input);
    std::string hex_result = uint64_to_hex(hash);
    
    return Napi::String::New(env, hex_result);
}

// Calculate distance between two hex fingerprints
Napi::Number DistanceWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
        Napi::TypeError::New(env, "Two hex string arguments expected").ThrowAsJavaScriptException();
        return Napi::Number::New(env, 64);
    }

    std::string hex_a = info[0].As<Napi::String>().Utf8Value();
    std::string hex_b = info[1].As<Napi::String>().Utf8Value();
    
    uint64_t a = hex_to_uint64(hex_a);
    uint64_t b = hex_to_uint64(hex_b);
    
    int dist = ECE::Fingerprint::Distance(a, b);
    
    return Napi::Number::New(env, dist);
}

// Check if two texts are duplicates based on threshold
Napi::Boolean IsDuplicateWrapped(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsString()) {
        Napi::TypeError::New(env, "Two string arguments expected").ThrowAsJavaScriptException();
        return Napi::Boolean::New(env, false);
    }

    std::string text_a = info[0].As<Napi::String>().Utf8Value();
    std::string text_b = info[1].As<Napi::String>().Utf8Value();
    
    int threshold = 3; // Default threshold
    if (info.Length() > 2 && info[2].IsNumber()) {
        threshold = info[2].As<Napi::Number>().Int32Value();
    }
    
    uint64_t hash_a = ECE::Fingerprint::Generate(text_a);
    uint64_t hash_b = ECE::Fingerprint::Generate(text_b);
    
    int dist = ECE::Fingerprint::Distance(hash_a, hash_b);
    
    return Napi::Boolean::New(env, dist < threshold);
}

// The Initialization (Like module.exports)
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "fingerprint"), Napi::Function::New(env, FingerprintWrapped));
    exports.Set(Napi::String::New(env, "distance"), Napi::Function::New(env, DistanceWrapped));
    exports.Set(Napi::String::New(env, "isDuplicate"), Napi::Function::New(env, IsDuplicateWrapped));

    return exports;
}

NODE_API_MODULE(fingerprint, Init)