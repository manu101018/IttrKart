export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const API = "http://localhost:4000";
// export const API = "https://major-finalbackend-lmlx.vercel.app";