const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'elrastroingweb@gmail.com',
      pass: process.env.ENVIAR_CORREOS,
    },
  });

module.exports = transporter;
  
