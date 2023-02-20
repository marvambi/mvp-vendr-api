import app from "./app";
import connect from "./utils/db";
import dotenv from "dotenv";

const dote = dotenv.config();
const HOST = dote.parsed?.HOST;
const PORT = dote.parsed?.PORT;

app.listen(PORT, () => {
  console.log(dote);
  connect()
    .then(() => console.log(`Application started @ URL ${HOST}:${PORT} 🎉`))
    .catch((e) => console.log("Error: ", e));
});
