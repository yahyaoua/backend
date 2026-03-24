const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Product = require('../models/Product');

router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, artisan } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,           // 'Miroir', 'Décoration' ou 'Cuir'
      stock,
      featured,
      artisan,
      image: req.file ? `uploads/${req.file.filename}` : ''
    });

    await product.save();
    res.status(201).json({ message: 'Produit ajouté avec succès', product });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;