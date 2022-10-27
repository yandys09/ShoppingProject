const app = require("./app");
const connectDb = require("./config/database");
require("colors");
const dotenv = require("dotenv");

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`.bgYellow.black);
  console.log(`ERROR: ${err.stack}`.bgRed.white.underline);
  console.log(
    `Shutting down server due to uncaught exception(잡히지 않는 예외로 인해 서버 종료)`
      .bgYellow.black
  );
  process.exit(1);

});

// Setting up config file
dotenv.config({ path: "backend/config/config.env" });

// Connecting to database
connectDb();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `PORT에서 서버 시작됨 : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
      .bgMagenta.white
  );
});

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`.bgRed.underline);
  console.log(
    `Server shutdown due to unhandled Promise rejection(처리되지 않은 Promise 거부로 인해 서버 종료)`
      .bgRed.yellow
  );
  server.close(() => {
    process.exit(1);
  });

});
