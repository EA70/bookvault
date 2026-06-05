require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: true, // Autorise localhost ET ton IP locale automatiquement ? Attention  en production, il faudra restreindre ça à ton domaine officiel !  
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Indispensable en production pour récupérer la vraie adresse IP de l'utilisateur
app.set('trust proxy', 1);

// Import des routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const adminRoutes = require("./routes/adminRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const userRoutes = require("./routes/UserRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Utilisation des routes
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", bookRoutes);
app.use("/api", adminRoutes);
app.use("/api/loans", borrowRoutes);
app.use("/api/categories", categoryRoutes );


app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Server läuft auf Port " + process.env.PORT);
});