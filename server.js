require("dotenv").config();
const express = require("express");
const path = require("path");

// Import routes
const scratchRoute = require("./routes/scratch");

const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/scratch", scratchRoute);

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// test change 2

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
