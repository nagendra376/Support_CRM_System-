const dotenv = require("dotenv");
const app = require("./server");
const connectDB = require("./config/db");

dotenv.config({
  path: "./.env",
}); //configure env

const port = process.env.PORT || 5000; //set port

connectDB() //connect to mongoDB
  .then(() => {
    app.listen(port, () => {
      //start server
      console.log(`Example app listrning on ${port}`);
    });
  })
  .catch((err) => {
    console.error("mongoDB connection errror");
    process.exit(1); //stops the Node.js process.
  });
