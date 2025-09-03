const jwt = require('jsonwebtoken');


module.exports = function auth(req, res, next) {
const authHeader = req.headers.authorization || '';
const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
if (!token) return res.status(401).json({ error: 'No autorizado: token faltante' });


try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = { id: decoded.id };
next();
} catch (err) {
return res.status(401).json({ error: 'Token inválido o expirado' });
}
};