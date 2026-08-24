const express = require("express");
const cors = require("cors");

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
const ApiError = require("./utils/api-error");

// basic configuration
app.use(express.json({ limit: "16kb" })); //read from client
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cors configuration
app.use(cors());

app.use("/api/tickets", ticketRoutes);

// Handle routes that do not exist
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Global error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    errors: error.errors || [],
  });
});

module.exports = app;
