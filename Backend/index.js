const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require('path'); // Added line
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

dotenv.config();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));  // Replace with your path

// Anything that doesn't match the above, send back the frontend's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));  // Replace with your path
});

app.listen(8800, () => {
  console.log("Backend server is running on port 8800!");
});
