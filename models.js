const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

//POST Schema
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  date: String,
  category: [String],
  post: { type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

//USER Schema
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    required: "Email address is required",
  },
  password: { type: String, required: true },
});

//COMMENT Schema
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const commentSchema = new Schema({
  comment: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  date: String,
});

const Comment = model("Comment", commentSchema);
const User = model("User", userSchema);
const Post = model("Post", postSchema);

module.exports = {
  Post,
  User,
  Comment,
};

// Alternative Approach
// const AuthorSchema = new Schema({
//   name: String
// });

// const BlogPostSchema = new Schema({
//   title: String,
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
//   comments: [{
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
//     content: String
//   }]
// });
