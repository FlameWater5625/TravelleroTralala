// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const admin = require('firebase-admin');

// Charger les variables d'environnement
dotenv.config();

// Initialisation de Firebase Admin
const serviceAccount = require('./firebaseServiceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Création de l'application Express
const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Exemple de route pour créer un itinéraire
app.post('/api/itineraire', async (req, res) => {
  const { userId, destination, date, budget, preferences } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO itineraires (user_id, destination, date, budget, preferences) VALUES (?, ?, ?, ?, ?)',
      [userId, destination, date, budget, JSON.stringify(preferences)]
    );
    res.status(201).json({ message: 'Itinéraire créé', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Exemple de route pour authentification avec Firebase
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
