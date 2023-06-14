require("dotenv").config();
const express = require("express");
const app = express();
const moment = require("moment");
const connectdb = require("./dbconnect");
connectdb().catch((err) => console.log(err));
const postRouter = require("./routes/posts");
const userRouter = require("./routes/users");
const commentRouter = require("./routes/comments");

// Parser
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API Routes:
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
app.use("/posts", postRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);

//Catch All
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
app.use("*", (req, res) => {
  res.status(404);
  res.send("Invalid URL");
});

//Server
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
app.listen(3000, () => {
  console.log("Started on:");
  console.log(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
  console.log("listening on Port 3000");
});
