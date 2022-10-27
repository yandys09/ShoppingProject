const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "이름을 입력하세요!"],
    maxLength: [30, "이름은 30자를 초과할 수 없습니다."],
  },
  email: {
    type: String,
    required: [true, "이메일을 입력하세요.!"],
    unique: true,
    validate: [validator.isEmail, "유효한 이메일 주소를 입력하십시오."],
  },
  password: {
    type: String,
    required: [true, "비밀번호를 입력하세요."],
    minLength: [6, "비번은 6자 이상입니다."],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypting password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT token
userSchema.methods.getJwtToken = function(){
  return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  })
}

module.exports = mongoose.model("User", userSchema);
