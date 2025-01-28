import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is listening on port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to connect to server, ERRR: ${err}`);
  });