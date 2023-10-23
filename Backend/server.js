const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

const routes = require('./routes/index');

app.use('/', routes);
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://josemanuelsannav:BbqxLuDliivgxWR1@cluster0.bqymwmt.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 


// Control de errores
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a la base de datos MongoDB');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });
