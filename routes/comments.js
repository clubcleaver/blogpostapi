const express = require("express");
const moment = require("moment");
const { User, Comment, Post } = require("../models");
const { verifyToken } = require("../middleWare/token");
const ObjectId = require("mongoose").Types.ObjectId;
const { commentOwner } = require("../middleWare/validation");
const router = express.Router();

// Post Comment
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post("/", verifyToken, async (req, res) => {
  const userEmail = req.headers.decoded.email;
  const { comment: rComment } = req.body;
  const { postId } = req.body;
  const foundUser = await User.findOne({ email: userEmail }).catch((e) => e);
  if (foundUser) {
    const toSaveComment = new Comment({
      author: foundUser,
      comment: rComment,
      date: moment().format("Do MMMM YYYY"),
    });
    const savedComment = await toSaveComment.save().catch((e) => e);
    if (savedComment) {
      if (savedComment) {
        const postToUpdate = await Post.findOne({
          _id: new ObjectId(postId),
        }).catch((e) => e);
        if (postToUpdate) {
          postToUpdate.comments.push(savedComment);
          const updatedPost = await postToUpdate.save().catch((e) => e);
          if (updatedPost) {
            const postToSend = await updatedPost.populate({
              path: "comments",
              select: ["comment", "date"],
              populate: { path: "author", select: "username" },
            });
            res.send(postToSend);
          } else {
            res.status(500);
            res.json({ success: false, message: "Could not update Post" });
          }
        } else {
          res.status(500);
          res.json({ success: false, message: "relavant post not found" });
        }
      }
    } else {
      res.status(500);
      res.json({ success: false, message: "Could Not save Comment" });
    }
  } else {
    res.status(404);
    res.json({ success: false, message: "User Not found in DB" });
  }
});

// Delete Comment
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.delete("/", verifyToken, commentOwner, async (req, res) => {
  const userEmail = req.headers.decoded.email;
  const { postId } = req.body;
  const { commentId } = req.body;
  await User.findOne({ email: userEmail })
    .then(async (user) => {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: commentId } },
        { new: true }
      );
      if (!updatedPost) {
        res.status(404);
        res.json({ success: false, message: "Post not Found" });
      }
      await Comment.findByIdAndDelete({ _id: new ObjectId(commentId) }).catch(
        (e) => {
          res.status(404);
          res.json({ success: false, message: "Unable to delete Comment" });
        }
      );
      res.json({ success: true, message: "Comment Deleted", updatedPost });
    })
    .catch((e) => {
      res.status(403);
      res.json({ success: false, message: "Unable to authenticate User" });
    });
});

//Exports
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
module.exports = router;
