const Order = require('../models/Order');
const Product = require('../models/Product'); // IMPORTANT : On a besoin du modèle Product

const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        message: 'Pas de produits dans la commande' 
      });
    }

    // --- 1. VÉRIFICATION DES STOCKS ---
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Produit non trouvé : ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Stock insuffisant pour "${product.name}". (Disponible: ${product.stock}, Demandé: ${item.quantity})` 
        });
      }
    }

    // --- 2. CRÉATION DE LA COMMANDE ---
    // Si on arrive ici, c'est que tous les stocks sont OK
    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      shippingAddress
    });

    // --- 3. MISE À JOUR DES STOCKS (SOUSTRACTION) ---
    const updateStockPromises = items.map((item) => {
      return Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }, // On décrémente le stock
        { new: true }
      );
    });

    await Promise.all(updateStockPromises);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... Reste de tes fonctions (getMyOrders, getOrderById, etc.) qui ne changent pas
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createOrder, 
  getMyOrders, 
  getOrderById,
  getAllOrders,
  updateOrderStatus
};