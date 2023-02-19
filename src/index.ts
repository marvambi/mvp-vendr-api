import app from "./app";
import connect from "./utils/db";

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '80');

app.listen(PORT, () => {
  connect()
    .then(() => console.log(`Application started @ URL ${HOST}:${PORT} 🎉`))
    .catch(e => console.log('Error: ', e));
});