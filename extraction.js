// extraction.js - Minimal keyword extraction

function extractKeywords(text) {
  if (!text) return [];
  // Simple split by space, filter out short words
  return text.split(/\s+/).filter(word => word.length > 3);
}

module.exports = {
  extractKeywords
};
