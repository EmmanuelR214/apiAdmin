import { Coonexion } from "../db.js";
import webPush from "../libs/web-push.js";

export const Notificar = async (title, body) => {
  try {
    const notificacionPayload = {
      title: title,
      body: body,
    };
    // Obtiene todas las suscripciones de la base de datos
    const [suscripciones] = await Coonexion.query('SELECT * FROM suscripciones');
    // Define el tamaño del lote (puedes ajustar según las necesidades)
    const chunkSize = 10;
    // Función para procesar las notificaciones en lotes
    const processChunk = async (chunk) => {
      const promises = chunk.map((suscripcion) => 
        webPush.sendNotification(
          {
            endpoint: suscripcion.endpoint,
            keys: {
              p256dh: suscripcion.p256dh,
              auth: suscripcion.auth,
            },
          },
          JSON.stringify(notificacionPayload)
        ).catch(error => {
          console.error('Error al enviar la notificación a:', suscripcion.endpoint, error);
        })
      );
      await Promise.all(promises);
    };
    // Itera sobre las suscripciones en bloques (chunks)
    for (let i = 0; i < suscripciones.length; i += chunkSize) {
      const chunk = suscripciones.slice(i, i + chunkSize);
      await processChunk(chunk);
    }
    return ['Notificaciones enviadas.'];
  } catch (error) {
    console.log('Error al enviar las notificaciones:', error);
    return ['Error al notificar.', error];
  }
};