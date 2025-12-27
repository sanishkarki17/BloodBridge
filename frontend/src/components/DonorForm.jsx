import React, { useState } from "react";
import API_BASE_URL from "../api";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonorForm({ onSubmitted }) {
  const [role, setRole] = useState("donor");
  const [form, setForm] = useState({
    name: "",
    blood_group: "O+",
    district: "",
    city: "",
    phone: "",
    available: true,
    last_donated: "",
  });
  const [status, setStatus] = useState(null);

  function update(field) {
    return (e) => {
      const val =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((s) => ({ ...s, [field]: val }));
    };
  }

  async function submit(e) {
    e.preventDefault();
    setStatus("saving");
    try {
      const url =
        role === "donor"
          ? `${API_BASE_URL}/api/donors`
          : `${API_BASE_URL}/api/requests`;
      const payload = { ...form };
      if (role === "recipient") payload.available = 0;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("saved");
      setForm({
        name: "",
        blood_group: "O+",
        district: "",
        city: "",
        phone: "",
        available: true,
        last_donated: "",
      });
      onSubmitted && onSubmitted();
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form className="donor-form card" onSubmit={submit}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <label>
          <input
            type="radio"
            checked={role === "donor"}
            onChange={() => setRole("donor")}
          />{" "}
          Donor
        </label>
        <label>
          <input
            type="radio"
            checked={role === "recipient"}
            onChange={() => setRole("recipient")}
          />{" "}
          Recipient
        </label>
      </div>
      <div className="form-row">
        <input
          required
          placeholder="Sanish Karki"
          value={form.name}
          onChange={update("name")}
        />
        <select value={form.blood_group} onChange={update("blood_group")}>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <input
          placeholder="Jhapa"
          value={form.district}
          onChange={update("district")}
        />
        <input placeholder="Bhadrapur" value={form.city} onChange={update("city")} />
      </div>
      <div className="form-row">
        <input
          placeholder="Phone (e.g. +977980...)"
          value={form.phone}
          onChange={update("phone")}
        />
        <input
          type="date"
          placeholder="Last donated"
          value={form.last_donated}
          onChange={update("last_donated")}
        />
      </div>
      {role === "donor" && (
        <label style={{ display: "block", marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={form.available}
            onChange={update("available")}
          />{" "}
          Available to donate
        </label>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">Submit</button>
        <div style={{ alignSelf: "center" }}>
          {status === "saving"
            ? "Saving..."
            : status === "saved"
              ? "Saved!"
              : status === "error"
                ? "Error"
                : ""}
        </div>
      </div>
    </form>
  );
}
