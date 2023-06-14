const { User, Post, Comment } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;

// Fields Validation
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const fieldsCheck = async (req, res, next) => {
  const { email, password } = req.body;
  if (!emailRegex.test(`${email.trim()}`)) {
    res.status(409);
    res.json({ success: false, message: "Please enter a Valid Email" });
  } else if (password.length < 6) {
    res.status(409);
    res.json({ success: false, message: "Password Too Short" });
  } else {
    next();
  }
};

// Email Exists
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const emailExists = async (req, res, next) => {
  const { email: eml } = req.body;
  const semail = eml.toLowerCase().trim();
  const checkEmail = await User.findOne({ email: semail }).catch((e) => e);
  if (checkEmail) {
    res.status(409);
    res.json({ success: false, message: "Email Already Exists" });
  } else {
    next();
  }
};

//Owned Post
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const postOwner = async (req, res, next) => {
  const userEmail = req.headers.decoded.email;
  const { postId } = req.body;
  const foundPost = await Post.findOne({ _id: new ObjectId(postId) }).populate({
    path: "author",
    select: "email",
  });
  if (foundPost) {
    if (userEmail === foundPost.author.email) {
      next();
    } else {
      res.status(404);
      res.json({ success: false, message: "Owner Not Verified" });
    }
  } else {
    res.status(404);
    res.json({ success: false, message: "Post not found, Check your post ID" });
  }
};

//Comment Owner
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const commentOwner = async (req, res, next) => {
  const userEmail = req.headers.decoded.email;
  const { commentId } = req.body;
  const foundComment = await Comment.findOne({ _id: new ObjectId(commentId) })
    .populate({ path: "author", select: "email" })
    .catch((e) => e);
  if (foundComment) {
    if (userEmail === foundComment.author.email) {
      next();
    } else {
      res.status(403);
      res.json({ success: true, message: "User authentication failed" });
    }
  } else {
    res.status(404);
    res.json({ success: false, message: "Comment Does Not Exist" });
  }
};

//Exports
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
module.exports = {
  fieldsCheck,
  emailExists,
  postOwner,
  commentOwner,
};
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
