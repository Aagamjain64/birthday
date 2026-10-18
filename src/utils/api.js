const SESSION_KEY = "bhoomi-session";

export function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "local-session";
  }
}

export async function saveResponse(payload) {
  try {
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        ...payload,
      }),
    });
    if (!res.ok) throw new Error("save failed");
    return await res.json();
  } catch {
    return { ok: false };
  }
}

export async function fetchResponses() {
  const res = await fetch("/api/responses");
  if (!res.ok) throw new Error("Could not load responses");
  return res.json();
}
