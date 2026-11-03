"use client";
import { useState } from "react";

export default function Forma({ ucitajKnjige }) {
  const [naslov, setNaslov] = useState("");
  const [autor, setAutor] = useState("");
  const [godina, setGodina] = useState("");

  async function dodaj(e) {
    e.preventDefault();

    await fetch("http://127.0.0.1:8000/knjige", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ naslov, autor, godina: Number(godina) }),
    });

    setNaslov("");
    setAutor("");
    setGodina("");
    ucitajKnjige();
  }

  return (
    <form onSubmit={dodaj} className="flex flex-col gap-3">
      <input value={naslov} onChange={(e) => setNaslov(e.target.value)} placeholder="Naslov"
        className="bg-zinc-900 border border-zinc-700 text-white rounded-lg p-2" />
      <input value={autor} onChange={(e) => setAutor(e.target.value)} placeholder="Autor"
        className="bg-zinc-900 border border-zinc-700 text-white rounded-lg p-2" />
      <input value={godina} onChange={(e) => setGodina(e.target.value)} placeholder="Godina" type="number"
        className="bg-zinc-900 border border-zinc-700 text-white rounded-lg p-2" />
      <button className="bg-zinc-200 text-black font-semibold py-2 rounded-lg">Dodaj</button>
    </form>
  );
}