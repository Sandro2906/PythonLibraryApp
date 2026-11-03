"use client";
import { useEffect, useState } from "react";
import Forma from "./components/Forma";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";

function headers() {
  return { Authorization: "Bearer " + localStorage.getItem("token") };
}

export default function Home() {
  const [knjige, setKnjige] = useState([]);
  const [pretraga, setPretraga] = useState("");

  async function ucitajKnjige() {
    const res = await fetch(`${API_URL}/knjige`);
    const data = await res.json();
    setKnjige(data);
  }

  async function posudi(id) {
    await fetch(`${API_URL}/knjige/${id}/posudi`, { method: "PUT", headers: headers() });
    ucitajKnjige();
  }

  async function vrati(id) {
    await fetch(`${API_URL}/knjige/${id}/vrati`, { method: "PUT", headers: headers() });
    ucitajKnjige();
  }

  async function obrisi(id) {
    await fetch(`${API_URL}/knjige/${id}`, { method: "DELETE", headers: headers() });
    ucitajKnjige();
  }

  function odjava() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
    ucitajKnjige();
  }, []);

  const filtrirane = knjige.filter((k) =>
    k.autor.toLowerCase().includes(pretraga.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-black py-12 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-4xl font-extrabold text-white">📚 Biblioteka</h1>
          <button onClick={odjava} className="text-zinc-400 hover:text-white">
            Odjava
          </button>
        </div>
        <p className="text-zinc-400 mb-6">Evo knjiga koje se nalaze u bazi podataka:</p>

        <input
          value={pretraga}
          onChange={(e) => setPretraga(e.target.value)}
          placeholder="Pretraži po autoru..."
          className="w-full mb-10 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3"
        />

        {filtrirane.length === 0 ? (
          <p className="text-zinc-500">Nema knjiga.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {filtrirane.map((knjiga) => (
              <li
                key={knjiga.id}
                className={`bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-2xl p-6 flex flex-col justify-between ${
                  knjiga.posudjena ? "opacity-60" : ""
                }`}
              >
                <div>
                  <h2 className="text-xl font-bold text-white">{knjiga.naslov}</h2>
                  <p className="text-zinc-300 mt-1">Autor: {knjiga.autor}</p>
                  <p className="text-zinc-500 text-sm">Godina: {knjiga.godina}</p>
                  <p className="text-sm mt-1 text-zinc-400">
                    {knjiga.posudjena ? "Posuđena" : "Dostupna"}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Link
                    href={`/knjige/${knjiga.id}`}
                    className="flex-1 text-center bg-zinc-200 text-black font-semibold py-2 rounded-lg"
                  >
                    O knjizi
                  </Link>

                  {knjiga.posudjena ? (
                    <button
                      onClick={() => vrati(knjiga.id)}
                      className="flex-1 bg-zinc-700 text-green-400 font-semibold py-2 rounded-lg"
                    >
                      Vrati
                    </button>
                  ) : (
                    <button
                      onClick={() => posudi(knjiga.id)}
                      className="flex-1 bg-zinc-700 text-blue-400 font-semibold py-2 rounded-lg"
                    >
                      Uzmi
                    </button>
                  )}

                  <button
                    onClick={() => obrisi(knjiga.id)}
                    className="flex-1 bg-zinc-700 text-red-400 font-semibold py-2 rounded-lg"
                  >
                    Obriši
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Dodaj novu knjigu</h2>
          <Forma ucitajKnjige={ucitajKnjige} />
        </div>
      </main>
    </div>
  );
}