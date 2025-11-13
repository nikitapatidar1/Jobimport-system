import { useEffect, useState } from "react";
import axios from "axios";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { data } = await axios.get("/api/jobs/logs");
        setLogs(data || []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setError("Failed to load logs");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!logs.length) return <p>No logs found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Import Logs</h1>
      {logs.map(log => (
        <div
          key={log._id}
          style={{ border: "1px solid #ccc", borderRadius: "8px", margin: "10px 0", padding: "10px" }}
        >
          <p><strong>Feed URL:</strong> {log.feedUrl || "N/A"}</p>
          <p><strong>File Name:</strong> {log.fileName || "N/A"}</p>
          <p><strong>Timestamp:</strong> {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}</p>
          <p><strong>Total Fetched:</strong> {log.totalFetched ?? "N/A"}</p>
          <p><strong>Total Imported:</strong> {log.totalImported ?? "N/A"}</p>
          <p><strong>New Jobs:</strong> {log.newJobs ?? "N/A"}</p>
          <p><strong>Updated Jobs:</strong> {log.updatedJobs ?? "N/A"}</p>
          <p><strong>Failed Jobs:</strong></p>
          <ul>
            {(log.failedJobs || []).map(fj => {
              let reasonText;
              if (!fj.reason) reasonText = "N/A";
              else if (typeof fj.reason === "object") reasonText = JSON.stringify(fj.reason, null, 2);
              else reasonText = fj.reason;
              return <li key={fj._id || fj.externalId}>{reasonText}</li>;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
