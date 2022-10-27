const mongoose = require("mongoose");
require("colors");

const connectDb = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
     
    })
    .then((con) => {
      console.log(
        `MongoDB Database connected with HOST: ${con.connection.host}`.bgGreen.black
      );
    });
};

module.exports = connectDb;
