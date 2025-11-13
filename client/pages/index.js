// import { useEffect, useState } from "react";
// import { api } from "../services/api";

// export default function Home() {
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     api.get("/jobs/logs").then((res) => setLogs(res.data));
//   }, []);

//   return (
//     <div style={{ padding: 40 }}>
//       <h1>📊 Import History</h1>
//       <table border="1" cellPadding="10">
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

//               {/* <td>
//                 {(log.failedJobs || [])
//                   .map((fj) => {
//                     if (!fj.reason) return "N/A";
//                     if (typeof fj.reason === "string") return fj.reason;
//                     try {
//                       return JSON.stringify(fj.reason);
//                     } catch {
//                       return "Invalid reason";
//                     }
//                   })
//                   .join(", ")}
//               </td> */}

//               <td>
//                 {(log.failedJobs || [])
//                   .map((fj) => {
//                     if (!fj.reason) return "N/A";
//                     if (typeof fj.reason === "string") return fj.reason;
//                     if (fj.reason.message) return fj.reason.message;
//                     try {
//                       return JSON.stringify(fj.reason);
//                     } catch {
//                       return "Invalid reason";
//                     }
//                   })
//                   .join(", ")}
//               </td>

//               <td>{new Date(log.timestamp).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Home() {
  const [logs, setLogs] = useState([]);

  // useEffect(() => {
  //   api.get("/jobs/logs").then((res) => setLogs(res.data));
  // }, []);

  useEffect(() => {
    const fetchLogs = () =>
      api.get("/jobs/logs").then((res) => setLogs(res.data));

    fetchLogs(); // First time fetch jab page load ho

    const interval = setInterval(fetchLogs, 3600000); // 1 hour = 3600000 ms
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>📊 Import History</h1>
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
              <td colSpan={6} style={{ textAlign: "center" }}>
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
                    .map((fj, index) => {
                      if (!fj) return "N/A";
                      if (typeof fj === "string") return fj;
                      if (fj.reason)
                        return typeof fj.reason === "string"
                          ? fj.reason
                          : fj.reason.message || JSON.stringify(fj.reason);
                      return "N/A";
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
    </div>
  );
}
