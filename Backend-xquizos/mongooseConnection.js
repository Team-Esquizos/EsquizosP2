
const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/users";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose.connect(uri,{  
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});
module.exports = mongoose;