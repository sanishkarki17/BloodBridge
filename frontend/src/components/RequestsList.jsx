import React, { useEffect, useState } from "react";

export default function RequestsList() {
  const [requests, setRequests] = useState([]);

  async function load() {
    try {
      const r = await fetch("http://localhost:4000/api/requests");
      const data = await r.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
    const on = () => load();
    window.addEventListener("donor:updated", on);
    return () => window.removeEventListener("donor:updated", on);
  }, []);

  if (!requests.length) return <p>No active requests.</p>;

  return (
    <div className="donor-list">
      {requests.map((r) => (
        <div className="card" key={r.id}>
          <div className="card-header">
            <strong>{r.name}</strong>
            <span className="badge">{r.blood_group}</span>
          </div>
          <div className="card-body">
            <div>
              {r.district} — {r.city}
            </div>
            <div>{r.phone}</div>
            {r.hospital && <div>Hospital: {r.hospital}</div>}
            <div style={{ color: "#999", fontSize: "0.85rem" }}>
              Requested: {new Date(r.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
