import { handleResponsesRequest } from "../../server/responses.js";

export const handler = async (event) => {
  const method = event.httpMethod || "GET";
  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      body = {};
    }
  }
  const result = await handleResponsesRequest(method, body);
  return {
    statusCode: result.status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.payload),
  };
};
