/**
 * KEY VAULT
 * API key encryption and storage utilities.
 *
 * API keys must never be stored in public source files.
 * Encryption and decryption will be implemented
 * in the browser using Web Crypto.
 */

function validasiProvider(provider) {
  var daftarProvider = [
    "gemini",
    "openai",
    "groq",
    "openrouter",
    "mistral"
  ];

  return daftarProvider.indexOf(
    String(provider || "").toLowerCase()
  ) !== -1;
}

function validasiFormatApiKey(provider, apiKey) {
  if (!validasiProvider(provider)) {
    throw new Error("Provider tidak didukung.");
  }

  if (
    typeof apiKey !== "string" ||
    apiKey.trim().length < 10 ||
    apiKey.length > 500
  ) {
    throw new Error("Format API Key tidak valid.");
  }

  return true;
}
