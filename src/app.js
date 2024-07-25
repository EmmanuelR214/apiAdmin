import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import indexRoutes from './routers/admin.routes.js'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.use("/api",indexRoutes)

app.get("/api", (req, res) => {
    res.send('Bienvenido a la Api')
})

app.get('/', (req, res) => {
    res.send('¡El API está en funcionamiento!')
})

app.use((req,res, next)=>{
    res.status(404).json({
        message:"ruta no encontrada"
    })
})

export default app