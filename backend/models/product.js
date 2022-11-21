const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "상품명을 입력하세요.!"],
    trim: true,
    maxLength: [100, "상품명의 문자 길이는 100자 이내."],
  },
  price: {
    type: Number,
    required: [true, "가격을 입력하세요!"],
    maxLength: [5, "제품 이름은 5자를 초과할 수 없습니다."],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "상품설명을 입력해주세요!"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "이 제품의 카테고리를 선택하세요!"],
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "제품에 대한 올바른 카테고리를 선택하세요.!~~",
    },
  },
  seller: {
    type: String,
    required: [true, "제품 판매자를 입력하세요.!"],
  },
  stock: {
    type: Number,
    required: [true, "제품 재고를 입력하세요.!"],
    maxLength: [5, "제품의 숫자는 5자를 초과할 수 없습니다.!"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
