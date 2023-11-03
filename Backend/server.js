const express = require("express");
const v1ProductRouter = require("./v1/routes/productRoutes");
const v1PujaRouter = require("./v1/routes/pujaRoutes");
const v1ExternosRouter = require("./v1/routes/externosRoutes");

const colors = require("picocolors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/v1/productos", v1ProductRouter);
app.use("/api/v1/pujas", v1PujaRouter);
app.use("/api/v1/externos", v1ExternosRouter);

app.listen(PORT, () => {
  console.log(colors.bgGreen(`Server is running on port ${PORT}`));
});

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://josemanuelsannav:BbqxLuDliivgxWR1@cluster0.bqymwmt.mongodb.net/IngWeb?retryWrites=true&w=majority"
);

// Control de errores
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log(colors.bgGreen("Conectado a la base de datos MongoDB"));
});

app.use((err, req, res, next) => {
  console.error(colors.red(err.stack));
  res.status(500).json({ error: "Something went wrong!" });
});
