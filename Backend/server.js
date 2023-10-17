const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Prueba');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/*const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tu-base-de-datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); */



