const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token no proporcionado' });
  }

  try {
    const cleanedToken = token.replace('Bearer ', '');

    const ticket = await client.verifyIdToken({
      idToken: cleanedToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    req.user = payload;

    next(); // Llama al siguiente middleware o ruta
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token no válido' });
  }
};

module.exports = authMiddleware;
