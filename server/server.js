// const express = require("express");
// const connectToDB = require("./config/db.config");
// const movieRouter = require("./routes/movie.route");
// const userRouter = require("./routes/user.route");
// require("dotenv").config();
// var cors = require('cors')

// const app = express();

// app.use(cors())

// const storage = multer.diskStorage({
//   destination: "./upload/images",
//   filename: (req, file, cb) => {
//     return cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({ storage: storage });

// app.use("/images", express.static("upload/images"));

// app.post("/upload", upload.single("movies"), (req, res) => {
//   res.json({
//     success: 1,
//     image_url: http://localhost:${PORT}/images/${req.file.filename},
//   });
// });

// app.use(express.json());

// connectToDB();

// app.use("/movie", movieRouter);
// app.use("/user", userRouter);

// app.listen(process.env.PORT, () => {
//   console.log("Server is running on port " + process.env.PORT);
// });

const express = require("express");
const multer = require("multer");
const path = require("path");
const connectToDB = require("./config/db.config");
const movieRouter = require("./routes/movie.route");
const userRouter = require("./routes/user.route");
require("dotenv").config();
var cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to propftx" });
});
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// Upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
  });
});

// Connect DB and other routes
connectToDB();
app.use("/movie", movieRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
