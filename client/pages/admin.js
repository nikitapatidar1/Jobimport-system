// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Admin() {
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     axios.get("/api/import-logs").then((res) => setLogs(res.data));
//   }, []);

//   return (
//     <div>
//       <h1>Import History</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>File Name</th>
//             <th>Total</th>
//             <th>New</th>
//             <th>Updated</th>
//             <th>Failed</th>
//             <th>Timestamp</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logs.map((log) => (
//             <tr key={log._id}>
//               <td>{log.fileName}</td>
//               <td>{log.totalFetched}</td>
//               <td>{log.newJobs}</td>
//               <td>{log.updatedJobs}</td>
//               <td>{log.failedJobs}</td>
//               <td>{new Date(log.timestamp).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import HistoryTable from "../components/HistoryTable";

export default function Admin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/import-logs");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const importJobs = async () => {
    const feedUrl = "https://jobicy.com/?feed=job_feed"; // example, can make dynamic
    const fileName = "jobicy_feed";

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/jobs/import", {
        feedUrl,
        fileName,
      });
      alert("Import job added to queue!");
      fetchLogs(); // refresh logs after import
    } catch (err) {
      console.error(err);
      alert("Error adding import job!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>📊 Import History</h1>
      <button
        onClick={importJobs}
        disabled={loading}
        style={{ marginBottom: 20 }}
      >
        {loading ? "Importing..." : "Import Jobs Now"}
      </button>
      <HistoryTable logs={logs} />
    </div>
  );
}
