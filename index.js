import app from "./src/app.js"
import { PORT } from "./src/config.js"

app.listen(PORT, () => {
  console.log('La aplicación está escuchando en el puerto ' + PORT);
});

