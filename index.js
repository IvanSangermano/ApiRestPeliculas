const {conexion} = require("./baseDatos/conexion");
const express = require("express")
const cors = require("cors")

//Inicializar app
console.log("App de node corriendo");
//Conectar a la base de datos
conexion();


//crear servidor Node
const app = express();
const puerto = 3900;

//configurar cors
app.use(cors());

//convertir body a objeto JS
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//RUTAS
const rutas_articulo = require("./rutas/articulo");

//cargar rutas de articulos
app.use("/api", rutas_articulo)

//crear rutas hardcodeadas
app.get("/probando", (req, res) => {
    return res.status(200).json({
        status: "sucess",
        message: "Probando ruta correctamente"
    })
})

app.get("/", (req, res) => {
    return res.status(200).send(`
    <div>
        <h1>Se ha inicializado correctamente la API</h1>
        <h2>Escuchando peticiones!!!</h2>
    </div>`)
})

//crear servidor y escuchar peticiones http
app.listen(puerto, () =>{
    console.log("Servidor corriendo en el puerto " + puerto);
})