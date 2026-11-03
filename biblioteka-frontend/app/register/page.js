"use client";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");

  async function registracija(e) {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lozinka }),
    });

    if (!res.ok) {
      alert("Registracija nije uspjela (možda email već postoji)");
      return;
    }

    alert("Registracija uspješna, sad se uloguj");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form onSubmit={registracija} className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-white">Registracija</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="bg-black border border-zinc-700 text-white rounded-lg p-2" />
        <input value={lozinka} onChange={(e) => setLozinka(e.target.value)} placeholder="Lozinka" type="password"
          className="bg-black border border-zinc-700 text-white rounded-lg p-2" />
        <button className="bg-zinc-200 text-black font-semibold py-2 rounded-lg">Registruj se</button>
        <p className="text-zinc-400 text-sm">
          Već imaš nalog? <Link href="/login" className="text-white underline">Uloguj se</Link>
        </p>
      </form>
    </div>
  );
}