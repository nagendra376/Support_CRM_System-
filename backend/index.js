const dotenv = require("dotenv");
const app = require("./server");
const connectDB = require("./config/db");

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
