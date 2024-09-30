const express = require("express");
// const cors = require("cors");
require("dotenv").config();
const postModel = require("./models/posts");
const likeModel = require("./models/likes");
const userModel = require("./models/users");
const commentModel = require("./models/comments");
const { populate } = require("dotenv");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));            

// const whitelist = [process.env.CLIENT_URL]; //This allows fronted to access content from routes of server
// const corsOptions = {
//   origin: function (origin, callback) {
//     if(whitelist.indexOf(origin) !== -1 || !origin){
//       callback(null, true); //Allow the request
//     } 
//     else{
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, //Allows cookies to be sent
// }

// app.use(cors(corsOptions)); //Use CORS middleware

const COMMENT_SELECT_FIELDS = {
  path: "comments",
  select: "_id message parentId createdAt userId",
  options: {
    sort: { createdAt: -1 }
  },
  populate: {
    path: "userId",
    select: "_id name"
  }
}

app.get("/", (req, res) => {
  res.send("Home page");
})

app.get("/posts", async (req, res) => {
  try {
    const posts = await postModel.find();
    return res.json(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const post = await postModel.findOne({ _id: req.params.id })
    .select("title body")
    .populate(
      COMMENT_SELECT_FIELDS
    );
    return res.json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/posts/:id/comments", async (req, res) => {
  if(req.body.message === "" || req.body.message == null){
    return res.status(400).json({ message: "Message is required" })
  } 
  const commentData = {
    message: req.body.message,
    userId: new mongoose.Types.ObjectId("66db4ebebd2dcd940dedd973"),
    postId: new mongoose.Types.ObjectId(req.params.id)
  };
  if (req.body.parentId) {
    commentData.parentId = req.body.parentId;
  }
  const comment = await commentModel.create(commentData);
  
  if (req.body.parentId) {
    const parentComment = await commentModel.findOne({_id: req.body.parentId})
    parentComment.comments.push(comment._id)
    await parentComment.save();
  }

  const commentPopulate = await commentModel.findOne({_id: comment._id})
  .select("_id message parentId createdAt userId")
  .populate(
    {
      path: "userId",
      select: "_id name"
    }
  )


  let post = await postModel.findOne({_id: req.params.id});
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  post.comments.push(comment._id)
  await post.save()

  let user = await userModel.findOne({_id: "66db4ebebd2dcd940dedd973"}); //Take later from cookie
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.comments.push(comment._id);
  await user.save();
  console.log(commentPopulate);

  return res.json(commentPopulate);
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    if(req.body.message === "" || req.body.message == null){
      return res.status(400).json({ message: "Message is required" })
    } 
    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.commentId,
      {message: req.body.message},
      {new: true} // This option returns the updated document
    );
    const commentPopulate = await commentModel.findOne({_id: updatedComment._id})
    .select("_id message parentId createdAt userId")
    .populate(
      {
        path: "userId",
        select: "_id name"
      }
    )
    return res.json(commentPopulate);
  } catch (error) {
    return res.status(400).json({ message: `Error from backend:- ${error}` })
  }
})

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    // Find the comment first
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    // Now call remove to trigger the pre-remove middleware
    await comment.remove();
    return res.send(comment._id);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while deleting the comment' });
  }
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});