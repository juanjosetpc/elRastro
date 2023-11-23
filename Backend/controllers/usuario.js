const Usuario = require("../models/usuario");


const getResenas = async (req, res) => {
    const email = req.params.email;
    try{
        const usuario = await Usuario.findOne({
            email:email,
        });
        if(!usuario || usuario.length === 0){
            return res.status(404).json({ error: "No se encontro usuario" });
        } else if(!usuario.resenas){
            return res.status(404).json({ error: "No se encontraron resenas" });
        }
        const resenas = usuario.resenas;
        res.json(resenas);
    } catch (error){
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
};

const crearResena = async (req, res) => {
    try {
        const { propEmail, nota, descripcion } = req.body;
        const usuario = await Usuario.findOne({ email: propEmail });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.resenas.push({ nota, descripcion });
        await usuario.save();
        res.status(201).json({ mensaje: 'Reseña añadida correctamente' });
    } catch (error) {
      console.error('Error al añadir reseña:', error);
      res.status(500).json({ error: 'Error al añadir reseña' });
    }
};

module.exports = {
    getResenas,
    crearResena,
};