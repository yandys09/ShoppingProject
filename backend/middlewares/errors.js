require("colors");

const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };

    error.message = err.message;

    // Wrong Mongoose Object ID Error
    if (err.name === "CastError") {
      const message = `리소스를 찾을 수 없습니다. 유효하지 않은: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose Validation Error
    if (err.name === "유효성 검사 오류") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose duplicate key errors
    if (err.code === 11000) {
      const message = `중복 ${Object.keys(err.keyValue)} 입력되었습니다.`;
      error = new ErrorHandler(message, 400);
    }

    // Handling wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON 웹 토큰이 잘못되었습니다. 다시 시도하십시오!!";
      error = new ErrorHandler(message, 400);
    }

    // Handling Expired JWT error
    if (err.name === "TokenExpiredError") {
      const message = "JSON 웹 토큰이 만료되었습니다. 다시 시도하십시오!!";
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "내부 서버 에러 ~~~~",
    });
  }
};
