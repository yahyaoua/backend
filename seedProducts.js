const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  { name: "Miroir Atlas", category: "Miroir", price: 350,
    description: "Miroir artisanal au cadre sculpté à la main.",
    stock: 5, featured: true, artisan: "Artistique Machine" },
  { name: "Miroir Soleil", category: "Miroir", price: 290,
    description: "Miroir décoratif inspiré du soleil.",
    stock: 4, featured: true, artisan: "Artistique Machine" },
  { name: "Miroir Berbère", category: "Miroir", price: 320,
    description: "Miroir avec motifs berbères traditionnels.",
    stock: 3, featured: true, artisan: "Artistique Machine" },
  { name: "Porte-clés Cuir Classique", category: "Cuir", price: 45,
    description: "Porte-clés élégant en cuir véritable.",
    stock: 20, featured: false, artisan: "Artistique Machine" },
  { name: "Porte-clés Artisan", category: "Cuir", price: 55,
    description: "Porte-clés fabriqué à la main style marocain.",
    stock: 15, featured: false, artisan: "Artistique Machine" },
  { name: "Porte-clés Nomade", category: "Cuir", price: 50,
    description: "Accessoire inspiré de la culture nomade.",
    stock: 12, featured: false, artisan: "Artistique Machine" },
  { name: "Décoration Murale", category: "Décoration", price: 180,
    description: "Décoration murale faite à la main.",
    stock: 7, featured: true, artisan: "Artistique Machine" },
  { name: "Boîte Décorative", category: "Décoration", price: 120,
    description: "Boîte artisanale élégante.",
    stock: 9, featured: false, artisan: "Artistique Machine" },
  { name: "Sac en Cuir Tradition", category: "Cuir", price: 450,
    description: "Sac en cuir artisanal pratique et durable.",
    stock: 6, featured: true, artisan: "Artistique Machine" },
  { name: "Portefeuille en Cuir", category: "Cuir", price: 150,
    description: "Portefeuille en cuir fait à la main.",
    stock: 11, featured: false, artisan: "Artistique Machine" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');
    await Product.deleteMany({});
    console.log('Anciens produits supprimés');
    await Product.insertMany(products);
    console.log('10 produits insérés avec succès !');
    process.exit();
  } catch (error) {
    console.error('Erreur :', error.message);
    process.exit(1);
  }
};

seedDB();