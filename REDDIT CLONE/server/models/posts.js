const mongoose = require("mongoose");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid"); // Import the uuid function

mongoose.connect(`${process.env.DATABASE_URL}`);

const postSchema = mongoose.Schema({
  title: String,
  body: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment"
    }
  ]
});

// Middleware to handle cascade delete (Here first parameter of mongoose.model() is considered in this.model())
postSchema.pre("remove", async function(next) {
  try {
    await this.model("comment").deleteMany({postId: this._id}); 
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("post", postSchema);