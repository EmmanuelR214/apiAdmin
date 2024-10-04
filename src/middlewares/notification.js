import pkg  from "web-push";
import { Coonexion } from "../db.js";
const webPush = pkg

const validKeys = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  "mailto:labarbada23@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

// Ruta para recibir y almacenar la suscripción en la base de datos
export const Subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;
    console.log(subscription)
    const {endpoint, keys} = subscription
    
    const p256dh = keys.p256dh;
    const auth = keys.auth;
    
    await Coonexion.execute(`INSERT INTO suscripciones (endpoint, p256dh, auth) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE p256dh = ?, auth = ?`, [endpoint, p256dh, auth, p256dh, auth])
    
    res.status(201).json(['Suscripción guardada en la base de datos.']);
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al guardar la suscripción.']);
  }
}

export const Notificar = async (title, body) => {
  try {
    const notificacionPayload = {
      title: title,
      body: body,
    }
    const [suscripciones] = await Coonexion.query('SELECT * FROM suscripciones')
    
    const promises = suscripciones.map((suscripcion) =>
      webPush.sendNotification(
        {
          endpoint: suscripcion.endpoint,
          keys: {
            p256dh: suscripcion.p256dh,
            auth: suscripcion.auth,
          },
        },
        JSON.stringify(notificacionPayload)
      )
    );
    await Promise.all(promises);
    return ['Notificaciones enviadas.'];
  } catch (error) {
    console.log(error)
    return ['Error al notificar.'];
  }
} 