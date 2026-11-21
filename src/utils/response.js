export const sendResponse = (statusCode, data) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: data === undefined ? "" : JSON.stringify(data),
});
