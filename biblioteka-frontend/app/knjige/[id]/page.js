import Link from "next/link";

export default async function KnjigaDetalji({ params }) {
  const { id } = await params; // npr. "5" iz /knjige/5

  const res = await fetch(`http://127.0.0.1:8000/knjige/${id}`, 
    { cache: "no-store" });

  const knjiga = await res.json();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{knjiga.naslov}</h1>
      <p>Autor: {knjiga.autor}</p>
      <p>Godina: {knjiga.godina}</p>
      <p className="mb-4">Status: {knjiga.posudjena ? "Posuđena" : "Dostupna"}</p>
      <Link href="/" className="text-blue-600 underline">
        Nazad
      </Link>
    </div>
  );
}