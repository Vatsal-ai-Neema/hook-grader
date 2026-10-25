"use client";
import { useState } from "react";

export default function Page() {
  const [step, setStep] = useState("landing");
  const [contact, setContact] = useState({ name: "", designation: "", email: "" });
  const [hook, setHook] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const setField = (k) => (e) => setContact({ ...contact, [k]: e.target.value });

  function submitContact(e) {
    e.preventDefault();
    if (!contact.name.trim() || !contact.designation.trim()) return setError("Enter your name and designation.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) return setError("Enter a valid email address.");
    setError("");
    setStep("tool");
  }

  async function submitHook(e) {
    e.preventDefault();
    if (!hook.trim()) return setError("Paste the first two lines of your post.");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, hook }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
      setResult(data);
      setStep("results");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function again() {
    setHook("");
    setResult(null);
    setError("");
    setStep("tool");
  }

  return (
    <main>
      {step === "landing" && (
        <>
          <h1>Is your LinkedIn hook good enough to stop the scroll?</h1>
          <p>Paste the first two lines of a post. You get a score out of 100, a line on every rule it fails, and 3 sharper rewrites.</p>
          <button onClick={() => setStep("form")}>Grade my hook</button>
        </>
      )}

      {step === "form" && (
        <form onSubmit={submitContact}>
          <h1>Who is this for?</h1>
          <p>We send nothing without asking. These details save your result.</p>
          <label htmlFor="name">Name</label>
          <input id="name" value={contact.name} onChange={setField("name")} autoComplete="name" />
          <label htmlFor="designation">Designation</label>
          <input id="designation" value={contact.designation} onChange={setField("designation")} autoComplete="organization-title" />
          <label htmlFor="email">Work email</label>
          <input id="email" type="email" value={contact.email} onChange={setField("email")} autoComplete="email" />
          {error && <div className="err" role="alert">{error}</div>}
          <button type="submit">Continue</button>
        </form>
      )}

      {step === "tool" && (
        <form onSubmit={submitHook}>
          <h1>Paste your hook</h1>
          <p>Only the first two lines of the post.</p>
          <label htmlFor="hook">Hook</label>
          <textarea id="hook" value={hook} onChange={(e) => setHook(e.target.value)} maxLength={600} />
          <div className="hint">{hook.length} / 600 characters</div>
          {error && <div className="err" role="alert">{error}</div>}
          <button type="submit" disabled={busy}>{busy ? "Grading..." : "Grade my hook"}</button>
        </form>
      )}

      {step === "results" && result && (
        <>
          <h1>Your hook score</h1>
          <div className="score"><b>{result.score}</b><span>out of 100</span></div>
          {result.failed.length === 0 ? (
            <p>This hook passes every rule.</p>
          ) : (
            <>
              <h2>What to fix</h2>
              <ul className="fails">{result.failed.map((f) => <li key={f.id}>{f.message}</li>)}</ul>
            </>
          )}
          <h2>3 rewrites</h2>
          {result.rewritesError && <div className="err">{result.rewritesError}</div>}
          {result.rewrites.map((r, i) => (
            <div className="rw" key={i}>
              <pre>{r.text}</pre>
              <small>{r.why}</small>
            </div>
          ))}
          <button className="ghost" onClick={again}>Grade another hook</button>
        </>
      )}
    </main>
  );
}
