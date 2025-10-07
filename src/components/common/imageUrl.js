export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") return ""; // return empty string or a fallback URL

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://75.119.138.163:5006";
      // const baseUrl= "http://10.10.7.46:5006";
    return `${baseUrl}/${path}`;
  }
};
