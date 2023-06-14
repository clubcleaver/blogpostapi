require("dotenv").config();
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { fieldsCheck, emailExists } = require("../middleWare/validation");

//Register
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post("/register", fieldsCheck, emailExists, async (req, res) => {
  console.log(`Register Request from ${req.ip}`);
  const { username: uname, email: eml, password: pass } = req.body;
  const semail = eml.toLowerCase().trim();
  const spass = pass.trim();
  const suname = uname.trim();
  const hashPass = await crypt.hash(spass, 10);
  const newUser = new User({
    username: suname,
    email: semail,
    password: hashPass,
  });
  newUser
    .save()
    .then((user) => {
      const sentUser = {
        success: true,
        username: user.username,
        email: user.email,
        password: "Hidden",
      };
      console.log("Registered Successfully");
      res.json(sentUser);
    })
    .catch((e) => {
      res.status(500);
      res.json({ success: false, message: "Unable to submit user to DB" });
    });
});

// Login
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.post("/login", async (req, res) => {
  const { email: eml, password: pass } = req.body;
  const seml = eml.toLowerCase().trim();
  const spass = pass.trim();
  await User.findOne({ email: seml })
    .then(async (user) => {
      await crypt.compare(spass, user.password, async function (err, response) {
        if (err) {
          // handle error
          res.status(500);
          res.json({
            success: false,
            Message: "Internal error with token Generation",
          });
        } else if (response) {
          //create Token
          console.log(user);
          const tokenUser = {
            id: user.id,
            username: user.username,
            email: user.email,
          };
          const token = await jwt.sign(tokenUser, process.env.tokenSecret, {
            expiresIn: "2 days",
          });
          //send response and token
          res.json({ success: true, message: "Logged In", token: token });
        } else {
          res.status(401);
          res.json({ success: false, message: "password does not match" });
        }
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(404);
      res.json({ success: false, message: "User Not Found" });
    });
});

//exports
// %%%%%%%%%%%%%%%%%%%%%%%%%%
module.exports = router;
