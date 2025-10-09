const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'examen',
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

app.post('/verif-resultat', (req, res) => {
    const { piece_id } = req.body;
  
    if (!piece_id) {
      return res.status(400).json({ error: 'Le numéro de pièce est requis' });
    }
  
    const sql = 'SELECT note, resultat, nom, prenom, centre, categorie FROM examen_ecrit WHERE piece_id = ?';
    db.query(sql, [piece_id], (err, results) => {
      if (err) {
        console.error('Erreur SQL :', err);
        return res.status(500).json({ error: 'Erreur lors de la requête' });
      }
  
      if (results.length > 0) {
        const { note, resultat, nom, prenom, centre, categorie } = results[0];
        res.json({ note, resultat, nom, prenom, centre, categorie });
      } else {
        res.status(404).json({ error: 'Numéro de pièce introuvable' });
      }
    });
  });

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
