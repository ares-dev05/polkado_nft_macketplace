function isNullOrWhitespace(text) {
  if(!text) {
    return true;
  }

  if(text.length === 0) {
    return true;
  }

  const hasNonWhiteSpace = /\S/.test(text);
  return !hasNonWhiteSpace;
}

module.exports = isNullOrWhitespace;