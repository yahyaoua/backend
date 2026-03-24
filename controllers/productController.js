const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const getProducts = async (req, res) => {
  try {
    let query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.featured) {
      query.featured = true;
    }

    if (req.query.search) {
      query.name = { 
        $regex: req.query.search, 
        $options: 'i' 
      };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, artisan } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      featured,
      artisan,
      image: req.file ? `uploads/${req.file.filename}` : ''
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, artisan } = req.body;

    // Récupérer l'ancien produit pour supprimer l'ancienne image si elle est remplacée
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Si une nouvelle image est uploadée, supprimer l'ancienne du disque
    if (req.file && existingProduct.image) {
      const oldImagePath = path.join(__dirname, '..', existingProduct.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedData = {
      name,
      description,
      price,
      category,
      stock,
      featured,
      artisan,
      image: req.file ? `uploads/${req.file.filename}` : existingProduct.image
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Supprimer l'image du disque lors de la suppression du produit
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};