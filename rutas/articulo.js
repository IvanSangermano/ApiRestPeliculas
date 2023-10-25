const {Router} = require("express");
const multer = require("multer")
const router = Router();
const ArticuloController = require("../controladora/articulo");

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./imagenes/articulos/");
    },
    filename: function(req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname)
    }
})

const subidas = multer({storage: almacenamiento});

router.get("/ruta-de-prueba", ArticuloController.prueba)

router.post("/crear", ArticuloController.crear)
router.get("/articulos", ArticuloController.listar)
router.get("/articulos/:id", ArticuloController.uno)
router.delete("/articulos/:id", ArticuloController.borrar)
router.put("/articulos/:id", ArticuloController.editar)
router.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloController.subir)
router.get("/imagen/:fichero", ArticuloController.imagen)
router.get("/buscar/:busqueda", ArticuloController.buscador)



module.exports = router