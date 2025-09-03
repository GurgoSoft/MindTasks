const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const router = express.Router();


// Registro
router.post(
'/register',
[
body('name').notEmpty().withMessage('Nombre requerido'),
body('email').isEmail().withMessage('Email inválido'),
body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
],
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { name, email, password } = req.body;
try {
let user = await User.findOne({ email });
if (user) return res.status(409).json({ error: 'El email ya está registrado' });


const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);


user = await User.create({ name, email, password: hashed });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
res.status(201).json({
user: { id: user._id, name: user.name, email: user.email },
token
});
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Error en el servidor' });
}
}
);


// Login
router.post(
'/login',
[
body('email').isEmail().withMessage('Email inválido'),
body('password').notEmpty().withMessage('Contraseña requerida')
],
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { email, password } = req.body;
try {
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });


const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
res.json({
user: { id: user._id, name: user.name, email: user.email },
token
});
} catch (err) {
console.error(err);
res.status(500).json({ error: 'Error en el servidor' });
}
}
);


module.exports = router;