const mongoose = require("mongoose");
require("colors");

const connectDb = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      // keepAlive: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `MongoDB Database connected with HOST: ${con.connection.host}`.bgGreen
          .black
      );
    });
};

module.exports = connectDb;
