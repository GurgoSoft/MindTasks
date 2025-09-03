const mongoose = require('mongoose');


async function connectDB(uri) {
try {
await mongoose.connect(uri);
console.log('✅ Conectado a MongoDB Atlas');
} catch (err) {
console.error('❌ Error conectando a MongoDB:', err);
process.exit(1);
}
}


module.exports = connectDB;