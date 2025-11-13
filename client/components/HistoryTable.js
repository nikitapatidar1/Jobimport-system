export default function HistoryTable({ logs }) {
  return (
    <table
      border="1"
      cellPadding="10"
      style={{ borderCollapse: "collapse", width: "100%" }}
    >
      <thead>
        <tr>
          <th>File Name</th>
          <th>Total</th>
          <th>New</th>
          <th>Updated</th>
          <th>Failed</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {logs.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: "center" }}>
              No logs found
            </td>
          </tr>
        ) : (
          logs.map((log) => (
            <tr key={log._id}>
              <td>{log.fileName || "N/A"}</td>
              <td>{log.totalFetched ?? "N/A"}</td>
              <td>{log.newJobs ?? "N/A"}</td>
              <td>{log.updatedJobs ?? "N/A"}</td>
              {/* <td>
                {(log.failedJobs || [])
                  .map((fj) => {
                    // Convert reason to string safely
                    if (fj.reason === null || fj.reason === undefined)
                      return "N/A";
                    if (typeof fj.reason === "string") return fj.reason;
                    try {
                      return JSON.stringify(fj.reason);
                    } catch {
                      return "Invalid reason";
                    }
                  })
                  .join(", ")}
              </td> */}
              <td>{log.failedJobs ?? 0}</td>

              <td>
                {log.timestamp
                  ? new Date(log.timestamp).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
