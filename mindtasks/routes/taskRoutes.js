const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');


const router = express.Router();


// Listar tareas del usuario
router.get('/', auth, async (req, res) => {
const tasks = await Task.find({ user: req.user.id }).sort({ deadline: 1 });
res.json(tasks);
});


// Crear tarea
router.post(
'/',
auth,
[
body('title').notEmpty().withMessage('Título requerido'),
body('deadline').isISO8601().withMessage('Fecha/hora inválida')
],
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { title, description, deadline } = req.body;
const task = await Task.create({
title,
description: description || '',
deadline: new Date(deadline),
user: req.user.id
});
res.status(201).json(task);
}
);


// Actualizar (título/desc/fecha/completado)
router.put('/:id', auth, async (req, res) => {
const allowed = ['title', 'description', 'deadline', 'completed'];
const updates = {};
for (const k of allowed) if (k in req.body) updates[k] = k === 'deadline' ? new Date(req.body[k]) : req.body[k];


const task = await Task.findOneAndUpdate(
{ _id: req.params.id, user: req.user.id },
updates,
{ new: true }
);
if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
res.json(task);
});


// Eliminar
router.delete('/:id', auth, async (req, res) => {
const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
res.json({ message: 'Tarea eliminada' });
});


module.exports = router;