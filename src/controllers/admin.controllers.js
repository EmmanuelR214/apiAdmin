import { Coonexion } from "../db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CreateAccessToken } from "../libs/jwt.js";
import { spawn } from 'child_process';
import { RecommendationMail } from "../middlewares/authMail.js";

const TokenSecret = process.env.TOKEN_SECRET

const compareData = async (data, hash) => {
  return await bcrypt.compare(data, hash)
}

const hashData = async (data) => {
  try {
      const saltRounds = 10
      const salt = await bcrypt.genSalt(saltRounds)
      const Encrypt = await bcrypt.hash(data, salt)
      return Encrypt
  } catch (error) {
      console.error('Error encriptar datos:', error)
      throw error 
  }
}

export const GetDatos = async(req, res) => {
  try {
    const [[user]] = await Coonexion.execute('CALL ObtenerUsuarios()')
    const [[reporte]] = await Coonexion.execute('CALL ReporteVentas()')
    const [[platillos]] = await Coonexion.execute('CALL ObtenerListaPlatillo()')
    
    const countUser = user.length
    const pendientes = reporte.filter(venta => venta.Estado_Pedido === "Pendiente").length
    const noPendientes = reporte.filter(venta => venta.Estado_Pedido !== "Pendiente").length
    
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const anioActual = fechaActual.getFullYear();
    const ventasMesActual = reporte.filter(venta => {
      const fechaVenta = new Date(venta.Fecha_Venta);
      return fechaVenta.getMonth() === mesActual && fechaVenta.getFullYear() === anioActual;
    });
    
    const totalVentasMesActual = ventasMesActual.reduce((total, venta) => {
      return total + parseFloat(venta.Total_Venta);
    }, 0.0);
    
    res.status(200).json({countUser, pendientes, noPendientes, totalVentasMesActual, reporte, user, platillos})
  } catch (error) {
    res.status(500).json(['Error al traer datos'])
  }
}

export const TraerDatosPlatillo = async(req, res) =>{
  try {
    const [[Tamaños]] =  await Coonexion.execute('CALL ObtenerTamaños()')
    const [[Categorias]] =  await Coonexion.execute('CALL ObtenerCategorias()')
    const [[Presentaciones]] =  await Coonexion.execute('CALL ObtenerPresentaciones()')
    const [[Platillos]] =  await Coonexion.execute('CALL ObtenerPlatillosRecomendacion()')
    const [[Guarniciones]] = await Coonexion.execute('CALL ObtenerGuarniciones()')
    res.status(200).json([Tamaños, Categorias, Presentaciones, Platillos, Guarniciones])
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al traer los datos del platillos'])
  }
}

export const InsertPlatillo = async (req, res) => {
  try {
    const { platillo, descripcion, categoria, imagen, combinaciones, extras, guarniciones } = req.body;
    // Insertar el nuevo platillo en la tabla de platillos
    const [result] = await Coonexion.execute('INSERT INTO platillos (nombre, descripcion, imagen, id_estadoPlatillo, id_categoria, id_sucursal, platillo_disponible) VALUES (?, ?, ?, ?, ?, ?, ?)', [platillo, descripcion, imagen, 3, categoria, 1, true]);
    const nuevoIdPlatillo = result.insertId;
    // Insertar las combinaciones de presentaciones y tamaños en la tabla de relacion_presentacion_tamaño
    for (const combinacion of combinaciones) {
      const { tamaño, presentacion, valor } = combinacion;
      const idTamaño = tamaño.value;
      const idPresentacion = presentacion.value;
      const precioAdicional = valor;
      await Coonexion.execute('INSERT INTO relacion_presentacion_tamaño (id_platillo, id_presentacion, id_tamaño, precio_adicional) VALUES (?, ?, ?, ?)', [nuevoIdPlatillo, idPresentacion, idTamaño, precioAdicional]);
    }
    // Insertar las recomendaciones en la tabla de recomendaciones
    for (const extra of extras) {
      const { value, label, precio } = extra;
      const idPlatilloRecomendado = value;
      const tipo = 'acompañamiento';
      await Coonexion.execute('INSERT INTO recomendaciones (id_platillo_principal, id_platillo_recomendado, tipo) VALUES (?, ?, ?)', [nuevoIdPlatillo, idPlatilloRecomendado, tipo]);
    }
    for (const guarnicion of guarniciones) {
      const { value, label, precio } = guarnicion;
      const idPlatilloRecomendado = value;
      const tipo = 'guarnicion';
      await Coonexion.execute('INSERT INTO recomendaciones (id_platillo_principal, id_platillo_recomendado, tipo) VALUES (?, ?, ?)', [nuevoIdPlatillo, idPlatilloRecomendado, tipo]);
    }
    res.status(200).json({ message: 'Platillo insertado exitosamente.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al insertar un platillo.' });
  }
}

export const EliminarPlatillo = async(req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const [[result]] = await Coonexion.execute('CALL Eliminar_platillo(?)', [id]);
    console.log(result);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Platillo Eliminado y Movido a Eliminados' });
    } else {
      res.status(404).json({ error: 'Platillo no encontrado' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(['Error al eliminar el platillo']);
  }
}

export const TraerDatosPlatilloActualizar = async(req, res) =>{
  try {
    const {id} = req.params
    const [rows] = await Coonexion.execute('CALL ObtenerDatosDePlatilloaActualizar(?)',[id])
    
    const resultado = {
      platillo: rows[0][0], 
      combinaciones: rows[1],
      recomendaciones: rows[2] 
    }
    
    
    res.status(200).json([resultado])
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al traer los datos del platillos'])
  }
}


export const LoginAdmin = async(req, res) =>{
  try {
      const {telefono, password} = req.body
      const [[result]] = await Coonexion.execute('CALL LoginCliente(?)',[telefono])
      const user = result[0]
      console.log(user)
      if(!user) return res.status(400).json(['El usuario no coincide'])
      
      if(user.roles === 'cliente') return res.status(400).json(['No tienes permisos para acceder'])
      
      const PasswordValid = await compareData(password, user.passwordUs)
      if (!PasswordValid) return res.status(400).json( ["Contraseña incorrecta"] )
      
      const token = await CreateAccessToken({id: user.id_usuario})
      res.json([user.id_usuario, user.roles, user.correo, token])
  } catch (error) {
      console.log(error)
      res.status(500).json(['Error al iniciar sesión'])
  }
}

//--------------------Prediccion-------------------
const getUserData = async () => {
  const [rows] = await Coonexion.execute('CALL PredictionGetDataUser()');
  return rows[0]
}

const updateUserCluster = async (id_usuario, cluster) => {
  await Coonexion.execute('UPDATE usuarios SET cluster = ? WHERE id_usuario = ?', [cluster, id_usuario])
}

const getNotification = async (cluster) => {
  console.log('cluster', cluster);
  const [rows] = await Coonexion.execute('CALL getPopularDishesByCluster(?)', [cluster]);
  let notification = 'Ofertas personalizadas para ti:\n';
  rows[0].forEach(row => {
      notification += `- ${row.platillo}\n`;
  });
  console.log(notification);
  return notification;
}

export const sendNotificationsPrediction = async(req, res) =>{
  try {
    const users = await getUserData()
    users.forEach(user => {
      const py = spawn('python', ['src/app/predict.py']);
      let result = '';
      py.stdin.write(JSON.stringify(user));
      py.stdin.end();
      py.stdout.on('data', (data) => {
          result += data.toString();
      });
      py.stdout.on('end', async () => {
        try {
          const cluster = JSON.parse(result).cluster;
          await updateUserCluster(user.id_usuario, cluster);
          const notification = await getNotification(cluster);
          console.log(notification);
          await RecommendationMail(user.correo, notification)
        } catch (error) {
          console.log(`Error al procesar resultados: ${error}`);
          return res.status(500).json(['Error al enviar notificaciones'])
        }
      });
      
      py.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
      });
  });
  res.status(200).json(['Notificaciones enviadas'])
  } catch (error) {
    res.status(500).json(['Error al enviar notificaciones'])
  }
}