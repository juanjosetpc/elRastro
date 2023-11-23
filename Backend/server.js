require("dotenv").config();
const express = require("express");
const cors = require("cors");
const colors = require("picocolors");
const v1ProductRouter = require("./v1/routes/productRoutes");
const v1PujaRouter = require("./v1/routes/pujaRoutes");
const v1ExternosRouter = require("./v1/routes/externosRoutes");
const v2ProductRouter = require("./v2/routes/productRoutes2");
const cron = require("node-cron");
const { actualizaDesiertas, actualizarSubastasExito } = require("./controllers/producto");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/api/v1/productos", v1ProductRouter);
app.use("/api/v2/productos", v2ProductRouter);
app.use("/api/v1/pujas", v1PujaRouter);
app.use("/api/v1/externos", v1ExternosRouter);

app.listen(PORT, () => {
  console.log(colors.bgGreen(`Server is running on port ${PORT}`));
});


// Actualiza las subastas desiertas y finaliza y notifica a los usuarios de las subastas terminadas con exito.
 //Se ejecuta cada 15 min
//  cron.schedule("*/15 * * * *", async () => {
//   console.log(colors.orange("Actualizando subastas desiertas, si las hay..."));
//   await actualizaDesiertas();
// });

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

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
