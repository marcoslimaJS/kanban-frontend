export default (string, maxSize) => {
  if (string) {
    if (string.length < maxSize) return string;
    const reducedString = string.slice(0, maxSize);
    return `${reducedString}...`;
  }
  return string;
};
