const mongoose = require("mongoose");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid"); // Import the uuid function

mongoose.connect(`${process.env.DATABASE_URL}`)

const likeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment"
  }
});

//Create a unique compound index on userId and commentId
likeSchema.index({userId: 1, commentId: 1}, {unique: true});

module.exports = mongoose.model("like", likeSchema);