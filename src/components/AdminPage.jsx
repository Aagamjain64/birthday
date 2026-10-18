import { useEffect, useState } from "react";
import { fetchResponses } from "../utils/api.js";

const LABELS = {
  letter_choice: "Sorry letter button",
  feedback: "Closing note",
};

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await fetchResponses();
      setItems(data.items || []);
      setError("");
    } catch {
      setError("Responses file could not be read. Keep the site running with npm run dev.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="admin-page">
      <h1>Bhoomi site responses</h1>
      <p>
        Letter buttons and the closing note are saved in MongoDB Atlas when{" "}
        <code>MONGODB_URI</code> is set. Otherwise they stay in <code>data/responses.json</code>.
      </p>
      <button type="button" className="glow-btn" onClick={load}>
        Refresh
      </button>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Answer</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4}>No answers yet.</td>
              </tr>
            ) : (
              items
                .slice()
                .reverse()
                .map((row) => (
                  <tr key={row.id}>
                    <td>{new Date(row.createdAt).toLocaleString()}</td>
                    <td>{LABELS[row.type] || row.type}</td>
                    <td>{row.value}</td>
                    <td>{row.sessionId}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      <p>
        <a href="/">Back to birthday site</a>
      </p>
    </main>
  );
}
