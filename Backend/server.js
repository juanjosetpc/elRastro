const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const routes = require('./routes/index');

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://josemanuelsannav:BbqxLuDliivgxWR1@cluster0.bqymwmt.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 



