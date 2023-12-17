const express = require("express");
const router = express.Router();
const Usuario = require("../../models/usuario");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


router.post('/logged', async (req, res) => {
  console.log('Solicitud recibida en /auth/logged');

  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const existingUser = await Usuario.findOne({ email: payload.email });

    if (!existingUser) {
      // Crear un nuevo usuario si no existe
      const newUser = new Usuario({
        email: payload.email,
        nombre: payload.given_name,
        apellido: payload.family_name,
      });

      await newUser.save();
    }
    

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token no válido' });
  }
});



module.exports = router;