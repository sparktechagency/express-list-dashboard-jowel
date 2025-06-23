export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") return ""; // return empty string or a fallback URL

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://75.119.138.163";
    return `${baseUrl}/${path}`;
  }
};
