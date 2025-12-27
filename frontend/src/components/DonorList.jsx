import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";

export default function DonorList() {
  const [donors, setDonors] = useState([]);

  async function load() {
    try {
      const r = await fetch(`${API_BASE_URL}/api/donors`);
      const data = await r.json();
      setDonors(data);
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

  return (
    <div className="donor-list">
      {donors.length === 0 ? (
        <p>No donors yet — add one with the form.</p>
      ) : (
        donors.map((d) => (
          <div className="card" key={d.id}>
            <div className="card-header">
              <strong>{d.name}</strong>
              <span className="badge">{d.blood_group}</span>
            </div>
            <div className="card-body">
              <div>
                {d.district} — {d.city}
              </div>
              <div>{d.phone}</div>
              <div>Available: {d.available ? "Yes" : "No"}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
