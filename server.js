require("dotenv").config();
const express = require("express");

// Import routes
const scratchRoute = require("./routes/scratch");

const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/scratch", scratchRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
