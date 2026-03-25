const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;
const dogRoutes = require("./routes/dogRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(express.json());
app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/favorite-dogs", dogRoutes);
app.use("/users" ,userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
