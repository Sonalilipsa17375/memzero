// ollama_wrapper.js - Minimal mock for Ollama API

function getCompletion(prompt) {
  // Mock: just echo the prompt
  return `Ollama response to: ${prompt}`;
}

module.exports = {
  getCompletion
};
