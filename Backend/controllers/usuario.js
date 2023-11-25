const Usuario = require("../models/usuario");

const getUsuario = async (req, res) => {
    const email = req.params.email;
    try {
        const usuario = await Usuario.findOne({
            email: email,
        });
        if(!usuario){
            return res.status(404).json({ error: "No se encontro usuario" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
};

const getResenas = async (req, res) => {
    const email = req.params.email;
    try{
        const usuario = await Usuario.findOne({
            email:email,
        });
        if(!usuario){
            return res.status(404).json({ error: "No se encontro usuario" });
        }
        const resenas = usuario.resenas;
        res.json(resenas);
    } catch (error){
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
};

const crearResena = async (req, res) => {
    try {
        const { emailVendedor, nota, descripcion } = req.body;
        const usuario = await Usuario.findOne({ email: emailVendedor });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.resenas.push({ nota, descripcion });
        await calcularValoracion(usuario);
        await usuario.save();
        res.status(201).json({ mensaje: 'Reseña añadida correctamente' });
    } catch (error) {
      console.error('Error al añadir reseña:', error);
      res.status(500).json({ error: 'Error al añadir reseña' });
    }
};

const calcularValoracion = async (usuario) => {
    if(usuario.resenas.length === 0){
        usuario.valoracion = 0;
    }
    const sumaNotas = usuario.resenas.reduce((acumulador, resena) => acumulador + resena.nota, 0);
    const mediaNotas = sumaNotas / usuario.resenas.length;
    usuario.valoracion = mediaNotas;
};

const getValoracion = async (req, res) => {
    const email = req.params.email;
    try {
        const usuario = await Usuario.findOne({ email: email });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const valoracion = usuario.valoracion;
        res.json(valoracion);
    } catch (error) {
        console.error('Error al obtener la valoracion:', error);
        res.status(500).json({ error: 'Error al obtener la valoracion' });
    }
}


module.exports = {
    getUsuario,
    getResenas,
    crearResena,
    getValoracion,
};