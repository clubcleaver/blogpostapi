const mongoose = require("mongoose");
require("dotenv").config();
//connection to database
const connectdb = async () => {
  await mongoose
    .connect(process.env.dbURL, { dbName: process.env.dbName })
    .then(() => {
        console.log("DB Connected")
    })
    .catch((e) => {
      console.log(e);
      console.log("could not connect to atlas");
    });
};
module.exports = connectdb;
