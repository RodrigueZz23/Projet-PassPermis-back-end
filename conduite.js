import React, { useState } from "react";
import styles from "../Style/Examen_conduite.module.css"; 
import Alert from '@mui/material/Alert';
import { IoCarSportOutline } from "react-icons/io5";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles["header-container"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-logo"]}>
            <img src="/images/permis.png" alt="Logo du Ministère" className={styles["header-logo-img"]} />
          </div>
          <div>
            <h1 className={styles["header-title"]}>Résultats du permis de conduire 2025</h1>
            <p className={styles["header-subtitle"]}>
              Ministère des Transports Routiers, Aériens et Ferroviaires
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function ResultCard({ data }) {
  if (!data) return null;
  const isAdmis = data.note >= 10;

  return (
    <div className={`${styles["result-card"]} ${isAdmis ? styles.admis : styles.refuse}`}>
      <h2>Résultats examen conduite 2025</h2>

      <div className={styles["info-grid"]}>
        <div><span>Numéro :</span> {data.id}</div>
        <div><span>Nom :</span> {data.nom}</div>
        <div><span>Prénom :</span> {data.prenom}</div>
        <div><span>Centre :</span> {data.centre}</div>
        <div><span>Catégorie :</span> {data.categorie}</div>
        <div><span>Note :</span> {data.note}</div>
        <div className={`${styles.badge} ${isAdmis ? styles.admis : styles.refuse}`}>
          {isAdmis ? "Admis" : "Refusé"}
        </div>
      </div>

      <div className={styles["message-box"]}>
        <h3>{isAdmis ? "Félicitations !" : "Résultat non satisfaisant !"}</h3>
        <p>
          {isAdmis
            ? "Vous êtes admis au test de conduite. Rendez-vous pour la suite des épreuves."
            : "Malheureusement, vous n'êtes pas admis au test de conduite."}
        </p>
      </div>

      <div className={styles["result-footer"]}>
        <small>Résultat publié le : {data.publishedAt || new Date().toISOString().split("T")[0]}</small>
        <button onClick={() => window.print()} className={styles.imprimer}><b>Imprimer ce résultat</b></button>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const key = query.trim().toUpperCase();
    if (!key) {
      setError("Veuillez entrer votre numéro de pièce d'identité.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/verif-resultat-conduite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ piece_id: key }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Aucun résultat trouvé pour ce numéro. Vérifiez et réessayez.");
        } else {
          setError("Erreur de communication avec le serveur.");
        }
        return;
      }

      const data = await response.json();
      setResult({
        id: key,
        nom: data.nom,
        prenom: data.prenom,
        centre: data.centre,
        categorie: data.categorie,
        note: data.note,
        resultat: data.resultat,
        publishedAt: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error(err);
      setError("Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.app}>
      <Header />

      <main>
        <section className={styles["search-box"]}>
          <h2>Consulter vos résultats</h2>
          <p className={styles["info-result"]}>Entrez le numéro de votre pièce d'identité pour accéder à vos résultats.</p>

          <form onSubmit={handleSearch}>
            <label className={styles["label-numPasseport"]}><b>Numéro de CNI/Passeport *</b></label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: EB765634"
            />
            <button type="submit" className={styles["btn-consulter"]}>
              <IoCarSportOutline /> {loading ? "Chargement..." : "Consulter examen conduite"}
            </button>
            {error && <Alert severity="error" className={styles["customAlert"]}>{error}</Alert>}
          </form>

          <div className={styles["info-box"]}>
            <h3>Informations importantes</h3>
            <ul>
              <li>Les résultats sont publiés selon le calendrier officiel.</li>
              <li>
                En cas de problème, contactez <a className={styles.mail} href="mailto:resultconduite@gmail.com">resultconduite@gmail.com</a>
              </li>
              <li>Service disponible 7j/7, 24h/24</li>
            </ul>
          </div>
        </section>

        {result && <ResultCard data={result} />}

        <footer className={styles.footer}>
          <div className={styles.links}>
            <a href="#">Mentions légales</a>
            <a href="#">Contact</a>
            <a href="#">Accessibilité</a>
            <a href="#">Données personnelles</a>
          </div>
          <p>© Gbegnon Komi Sedegnon Rodrigue - 2025</p>
        </footer>
      </main>
    </div>
  );
}
