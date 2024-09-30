const mongoose = require("mongoose");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid"); // Import the uuid function

mongoose.connect(`${process.env.DATABASE_URL}`);

const userSchema = mongoose.Schema({
  name: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment"
  }],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "like"
    }
  ]
});

userSchema.pre("remove", async function(next) {
  try {
    await this.model("comment").deleteMany({userId: this._id});
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("remove", async function(next) {
  try {
    await this.model("like").deleteMany({userId: this._id});
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("user", userSchema);