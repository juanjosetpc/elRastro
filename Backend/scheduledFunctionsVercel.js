//Archivo para que vercel ejecute las funciones rutinarias
// hará lo mismo que el cron que tenemos en server solo que ese solo funciona al ejecutar en local

const { actualizaDesiertas, actualizarSubastasExito } = require("./controllers/producto");
const {closeConversation} = require("./controllers/conversacion");

async function myScheduledFunction() {
  try {
    console.log("Ejecutando funciones periodicas...");

    await actualizaDesiertas();
    await closeConversation();
    await actualizarSubastasExito();

    console.log("Se han completado las actualizaciones.");
  } catch (error) {
    console.error("Error ejecutando las actualizaciones periodicas:", error);
  }
}

module.exports = myScheduledFunction;
