const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "avator/uz1zxscyhhgmvnmilgu0",
      url: "https://res.cloudinary.com/dwk2tuxbo/image/upload/v1659938219/avator/uz1zxscyhhgmvnmilgu0.png",
    },
  });

  sendToken(user, 200, res);
});

// Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("이메일과 비번을 입력하세요!~~"));
  }

  // Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("잘못된 이메일 또는 비밀번호입니다.!", 401));
  }

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("잘못된 이메일 또는 비밀번호입니다.!", 401));
  }

  sendToken(user, 200, res);
});

// forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler("이 이메일에서 사용자를 찾을 수 없습니다..!", 404)
    );
  }

  // Get reset token
   const resetToken = user.getResetPasswordToken();

   await user.save({ validateBeforeSave: false });

  // Create reset password url
   const resetUrl = `${req.protocol}://${req.get(
     "host"
   )}/password/reset/${resetToken}`;

  const message = `비밀번호 재설정 토큰은 다음과 같습니다.\n\n${resetUrl}\n\n이 이메일을 요청하지 않았다면 무시하십시오..`;

  try {

    await sendEmail({
      email: user.email, 
      subject: 'ShopIT Password Recovery',
      message
    })

    res.status(200).json({
      success: true,
      message: `Email set to: ${user.email}`
    })
    
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false});

    return next(new ErrorHandler(error.message, 500))
  }
});

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "로그 아웃!~~~",
  });
});
