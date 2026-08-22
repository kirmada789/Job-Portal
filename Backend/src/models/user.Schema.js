const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleID;
      },
    },
    role: {
      type: String,
      enum: ["seeker", "recruiter"],
      default: "seeker",
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

// 👈 Yahan 'next' hata diya hai kyunki async function bina next ke chalta hai
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;