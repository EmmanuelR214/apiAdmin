import { transporter } from "../libs/mailConfig.js";

export const RecommendationMail = async (email, recommendedDishes) => {
  await new Promise((resolve, reject) => {
      transporter.sendMail(
          {
              from: `"La Barbada" <labarbada23@gmail.com>`, // sender address
              to: email, // list of receivers
              subject: `¡Recomendaciones de Platillos!`, // subject line
              html: `
              <html lang="es">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Recomendaciones</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          margin: 0;
                          padding: 0;
                          background-color: rgb(32, 31, 31);
                      }
                      .container {
                          width: 100%;
                          max-width: 600px;
                          margin: 0 auto;
                          background-color: #101010;
                          padding: 20px;
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      }
                      .header {
                          text-align: center;
                          padding: 20px 0;
                      }
                      .header img {
                          max-width: 100px;
                      }
                      .content {
                          text-align: center;
                          padding: 20px 0;
                          color: #aaaaaa;
                      }
                      .content h1 {
                          font-size: 24px;
                      }
                      .content p {
                          font-size: 16px;
                      }
                      .content a:hover{
                          background-color: #a70e18;
                          font-size: large;
                      }
                      .button {
                          display: inline-block;
                          padding: 10px 20px;
                          margin: 20px 0;
                          font-size: 16px;
                          color: #ffffff;
                          background-color: #E20714;
                          text-decoration: none;
                          border-radius: 5px;
                      }
                      .image-section {
                          display: flex-columns;
                          justify-content: center;
                          padding: 20px 0;
                      }
                      .image-section img {
                          max-width: 100%;
                          margin: 10px;
                          border-radius: 10px;
                      }
                      .footer {
                          text-align: center;
                          padding: 20px 0;
                          font-size: 14px;
                          color: #aaaaaa;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <div class="header">
                          <img src="https://labarbada.store/imagenes/emblema.png" alt="Logo">
                      </div>
                      <div class="content">
                          <h1>¡Te recomendamos probar estos platillos!</h1>
                          <p>${recommendedDishes}</p>
                          <a href="https://labarbada.store/" class="button">Explorar</a>
                      </div>
                      <div class="image-section">
                          <img src="https://labarbada.store/imagenes/IMG_5002-Editar.jpg" alt="Imagen 1">
                      </div>
                      <div class="footer">
                          <p>Si tienes alguna pregunta, no dudes en <a href="https://api.whatsapp.com/send?phone=7712451795" style="color: #E20714;">contactarnos</a>.</p>
                          <p>&copy; 2024 La Barbada. Todos los derechos reservados.</p>
                      </div>
                  </div>
              </body>
              </html>
              `, // html body
          },
          (err, info) => {
              if (err) {
                  console.error(err);
                  reject(err);
                  return err;
              } else {
                  console.log(info);
                  resolve(info);
                  return info;
              }
          }
      );
  });
};

