import { addResponse, readResponses, usingMongo } from "./store.js";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString() || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

export async function handleResponsesRequest(method, body) {
  if (method === "GET") {
    return {
      status: 200,
      payload: { ok: true, store: usingMongo() ? "mongodb" : "json", items: await readResponses() },
    };
  }

  if (method === "POST") {
    if (!body?.type || typeof body.value !== "string" || !body.value.trim()) {
      return { status: 400, payload: { ok: false, error: "Missing type or value" } };
    }
    try {
      const saved = await addResponse({
        type: String(body.type).slice(0, 40),
        value: body.value.trim().slice(0, 4000),
        sessionId: String(body.sessionId || "").slice(0, 80),
      });
      return {
        status: 201,
        payload: { ok: true, store: usingMongo() ? "mongodb" : "json", item: saved },
      };
    } catch (error) {
      return { status: 500, payload: { ok: false, error: error.message } };
    }
  }

  return { status: 405, payload: { ok: false } };
}

export function responsesApi() {
  return async (req, res, next) => {
    const url = req.url?.split("?")[0] || "";
    if (url !== "/api/responses") {
      next();
      return;
    }
    const body = req.method === "POST" ? await readBody(req) : {};
    const result = await handleResponsesRequest(req.method, body);
    send(res, result.status, result.payload);
  };
}
