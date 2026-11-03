import os
import pymysql
import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_konekcija():
    return pymysql.connect(
        host="localhost",
        port=3307,
        user="root",
        password="lozinka123",
        database="fastapi_biblioteka",
        cursorclass=pymysql.cursors.DictCursor,
    )


class Knjiga(BaseModel):
    naslov: str
    autor: str
    godina: int


class Korisnik(BaseModel):
    email: str
    lozinka: str


def provjeri_token(authorization: str = Header()):
    try:
        token = authorization.replace("Bearer ", "")
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except:
        raise HTTPException(status_code=401, detail="Niste ulogovani")


# ---------- LOGIN / REGISTER ----------

@app.post("/register")
def register(korisnik: Korisnik):
    lozinka_hash = bcrypt.hashpw(korisnik.lozinka.encode(), bcrypt.gensalt()).decode()

    konekcija = get_konekcija()
    with konekcija.cursor() as cursor:
        cursor.execute(
            "INSERT INTO korisnici (email, lozinka_hash) VALUES (%s, %s)",
            (korisnik.email, lozinka_hash),
        )
    konekcija.commit()
    konekcija.close()
    return {"poruka": "Registracija uspješna"}


@app.post("/login")
def login(korisnik: Korisnik):
    konekcija = get_konekcija()
    with konekcija.cursor() as cursor:
        cursor.execute("SELECT * FROM korisnici WHERE email = %s", (korisnik.email,))
        iz_baze = cursor.fetchone()
    konekcija.close()

    if not iz_baze or not bcrypt.checkpw(korisnik.lozinka.encode(), iz_baze["lozinka_hash"].encode()):
        raise HTTPException(status_code=401, detail="Pogrešan email ili lozinka")

    token = jwt.encode({"id": iz_baze["id"]}, SECRET_KEY)
    return {"token": token}


# ---------- KNJIGE (svi mogu gledati) ----------

@app.get("/knjige")
def get_knjige():
    konekcija = get_konekcija()
    with konekcija.cursor() as cursor:
        cursor.execute("SELECT * FROM knjige")
        knjige = cursor.fetchall()
    konekcija.close()
    return knjige


@app.get("/knjige/{knjiga_id}")
def jedna_knjiga(knjiga_id: int):
    konekcija = get_konekcija()
    with konekcija.cursor() as cursor:
        cursor.execute("SELECT * FROM knjige WHERE id = %s", (knjiga_id,))
        knjiga = cursor.fetchone()
    konekcija.close()
    return knjiga


# ---------- KNJIGE (samo ulogovani) ----------

@app.post("/knjige")
def dodaj_knjigu(knjiga: Knjiga, korisnik=Depends(provjeri_token)):
    konekcija = get_konekcija()
    with konekcija.cursor() as cursor:
        cursor.execute(
            "INSERT INTO knjige (naslov, autor, godina) VALUES (%s, %s, %s)",
            (knjiga.naslov, knjiga.autor, knjiga.godina),
        )
    konekcija.commit()
    konekcija.close()
    return {"poruka": "Knjiga dodana"}


@app.delete("/knjige/{knjiga_id}")
def obrisi_knjigu(knjiga_id: int, korisnik=Depends(provjeri_token)):
    konekcija = get_konekcija()
    with konekcija.cursor() as cursor:
        cursor.execute("DELETE FROM knjige WHERE id = %s", (knjiga_id,))
    konekcija.commit()
    konekcija.close()
    return {"poruka": "Knjiga obrisana"}


@app.put("/knjige/{knjiga_id}/posudi")
def posudi_knjigu(knjiga_id: int, korisnik=Depends(provjeri_token)):
    konekcija = get_konekcija()
    with konekcija.cursor() as cursor:
        cursor.execute("UPDATE knjige SET posudjena = TRUE WHERE id = %s", (knjiga_id,))
    konekcija.commit()
    konekcija.close()
    return {"poruka": "Knjiga posuđena"}


@app.put("/knjige/{knjiga_id}/vrati")
def vrati_knjigu(knjiga_id: int, korisnik=Depends(provjeri_token)):
    konekcija = get_konekcija()
    with konekcija.cursor() as cursor:
        cursor.execute("UPDATE knjige SET posudjena = FALSE WHERE id = %s", (knjiga_id,))
    konekcija.commit()
    konekcija.close()
    return {"poruka": "Knjiga vraćena"}