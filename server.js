const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;
const dogRoutes = require("./routes/dogRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(cors());

app.use("/favorite-dogs", dogRoutes);
app.use("/users" ,userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
