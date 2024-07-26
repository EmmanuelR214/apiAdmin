import {Router} from 'express'
import {validateSchema} from '../middlewares/validator.middleware.js'
import { LoginSchema } from '../schemas/auth.schema.js'
import { ActualizarPlatillo, EliminarPlatillo, GenerarReportes, getCategorias, GetDatos, getMenuPorNombre, InsertPlatillo, LoginAdmin, sendNotificationsPrediction, TraerDatosPlatillo, TraerDatosPlatilloActualizar, TraerUsuarios } from '../controllers/admin.controllers.js'

const router = Router()

router.post('/login-admin', validateSchema(LoginSchema), LoginAdmin)

router.get('/datos', GetDatos)

router.get('/detalle-platillos', TraerDatosPlatillo)

router.post('/nuevo-platillo', InsertPlatillo)

router.get('/traer-datos-platillo-a-actualizar/:id', TraerDatosPlatilloActualizar)

router.patch('/actualizar-platillo/:id', ActualizarPlatillo)

router.delete('/delete-platillo/:id', EliminarPlatillo)

router.get('/menu-nombre', getMenuPorNombre)

router.get('/reportes', GenerarReportes)

router.get('/categiras', getCategorias)

router.get('/usuarios', TraerUsuarios)

//---------------predictions-----------------
router.post('/send-notifications-predictions', sendNotificationsPrediction)

export default router
