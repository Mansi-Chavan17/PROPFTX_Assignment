const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.log(err));
};

module.exports = connectToDB;
