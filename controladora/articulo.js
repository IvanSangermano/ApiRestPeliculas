const Articulo = require("../modelos/Articulo");
const {validarArticulo} = require("../helpers/validar");
const fs= require("fs");
const path = require("path");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "soy una accion de prueba en mi controlador de articulos"
    });
}

const crear = (req,res) => {
    let parametros = req.body

    try {
        validarArticulo(parametros)
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    const articulo = new Articulo(parametros);
        
    articulo.save().then((articuloGuardado) => {
        return res.status(200).json({
            sucess: "sucess",
            mensaje: "Accion de guardar",
            articulo: articuloGuardado
        })
    }).catch((error) =>{
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha guardado el articulo"
        })
    });
}


const listar = (req, res) => {
    let consulta = Articulo.find({})
                            .sort({fecha: -1})
                            .then((articulos) => {
                                return res.status(200).json({
                                    status: "sucess",
                                    articulos
                                })
                            }).catch((error) => {
                                return res.status(400).json({
                                    status: "error",
                                    mensaje: "No se ha encontrado los articulo"
                                })
    });
}

const uno = (req, res) => {
    id = req.params.id

    Articulo.findById(id)
            .then((articulo) => {
                return res.status(200).json({
                    status: "sucess",
                    articulo
                })
            }).catch((error) => {
                return res.status(400).json({
                    status: "error",
                    mensaje: "No se ha encontrado los articulo"
                })
    });
}

const borrar = (req, res) => {
    id = req.params.id

    Articulo.findByIdAndDelete(id)
            .then((articulo) => {
                return res.status(200).json({
                    status: "sucess",
                    articulo
                })
            }).catch((error) => {
                return res.status(400).json({
                    status: "error",
                    mensaje: "No se ha encontrado los articulo"
                })
    });
}



const editar = (req, res) => {
    id = req.params.id
    parametros = req.body

    try {
        validarArticulo(parametros)
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    Articulo.findOneAndUpdate({_id: id}, parametros, {new: true})
    .then((articulo) => {
        return res.status(200).json({
            status: "sucess",
            articulo
        })
    }).catch((error) => {
        return res.status(400).json({
            status: "error",
            mensaje: "No se ha encontrado los articulo"
        })
    });
}

const subir = (req, res) => {
    if(!req.file && !req.files){
        return res.status(400).json({
            status: "error",
            message: "Peticion invalida"
        })
    }

    let archivo = req.file.originalname;

    let archivoSplit = archivo.split("\.");
    let archivoExpension = archivoSplit[1];

    if(archivoExpension != "png" && archivoExpension != "jpg" && archivoExpension != "gif"){
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                message: "Archivo invalido"
            })
        })
    }else{
        id = req.params.id
    
        Articulo.findOneAndUpdate({_id: id}, {imagen: req.file.filename}, {new: true})
        .then((articulo) => {
            return res.status(200).json({
                status: "sucess",
                articulo,
                archivo: req.file
            })
        }).catch((error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado los articulo"
            })
        });
    }
}

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let rutaFisica = "./imagenes/articulos/" + fichero;

    fs.stat(rutaFisica, (error, existe) =>{
        if(existe) {
            return res.sendFile(path.resolve(rutaFisica))
        }else{
            return res.status(400).json({
                status: "error",
                message: "La imagen no existe"
            })
        }
    })
}

const buscador = (req, res) => {
    let busqueda = req.params.busqueda

    Articulo.find({ "$or": [
        {"titulo": {"$regex": busqueda, "$options": "i"}},
        {"contenido": {"$regex": busqueda, "$options": "i"}}
    ]})
    .sort({fecha: -1})
    .then((articulosEncontrados) => {
        return res.status(200).json({
            status: "sucess",
            articulosEncontrados
        })
    }).catch((error) => {
        return res.status(400).json({
            status: "error",
            message: "No se han encontrado articulos"
        });
    })
}

module.exports = {
    prueba,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}