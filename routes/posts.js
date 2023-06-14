const express = require("express");
const router = express.Router();
const moment = require("moment");
const {
  submit,
  getAll,
  getOne,
  edit,
  destroy,
} = require("../handle/handlePost");
const { Post, User, Comment } = require("../models");
const { verifyToken } = require("../middleWare/token");
const { postOwner } = require("../middleWare/validation");
var ObjectId = require("mongoose").Types.ObjectId;

//getAll
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get("/", async (req, res) => {
  console.log("Get request ALL");
  const allPosts = await getAll(Post);
  res.send(allPosts);
});

//getOne
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get("/:id", async (req, res) => {
  console.log("Get request ONE");
  const { id } = req.params;
  if (ObjectId.isValid(id.trim())) {
    const qid = { _id: new ObjectId(id.trim()) };
    const rPost = await getOne(Post, qid);
    if (rPost) {
      res.send(rPost);
    } else {
      res.send(404);
      res.json({ success: false, message: "Could Not locate" });
    }
  } else {
    res.status(404);
    res.json({ success: false, message: "Invalid ID" });
  }
});

//submit
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post("/", verifyToken, async (req, res) => {
  const { category: rCategory, post: rPost } = req.body;
  console.log(req.headers.decoded.email);
  await User.findOne({ email: req.headers.decoded.email })
    .then(async (user) => {
      const newPost = new Post({
        author: user, //handle Author
        date: moment().format("Do MMMM YYYY"),
        category: rCategory,
        post: rPost,
      });
      await submit(newPost)
        .then((post) => {
          console.log("Post Submit Request Success");
          res.json({ success: true, message: "Post Submitted Succesfully" });
        })
        .catch((e) => {
          console.log("Post Submit Request Failed");
          res.status(503);
          res.json({ success: false, message: "Internal DB Error" });
        });
    })
    .catch((e) => {
      res.status(404);
      res.json({ succes: false, message: "error at finding matching email" });
    });
});

//edit
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.patch("/", verifyToken, postOwner, async (req, res) => {
  const { postId, post: rPost } = req.body;
  const qid = { _id: postId.trim() };
  const result = await edit(Post, qid, { post: rPost });
  res.json({ success: true, result });
});

//delete
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.delete("/", verifyToken, postOwner, async (req, res) => {
  const { postId } = req.body;
  const qid = { _id: postId.trim() };
  const deleted = await destroy(Post, qid);
  const deletedComments = await Comment.deleteMany({
    _id: { $in: deleted.comments },
  });
  console.log(deleted, deletedComments);
  res.json({ success: true, message: "Post Deleted" });
});

module.exports = router;
