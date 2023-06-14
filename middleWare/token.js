require("dotenv").config();
const { User } = require("../models");
const jwt = require("jsonwebtoken");

// method attaches the user object to the req object as ** req.auth **
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  await jwt.verify(
    token.split(" ")[1],
    process.env.tokenSecret,
    async (err, decoded) => {
      if (decoded) {
        const userCheck = await User.findOne({ email: decoded.email });
        if (userCheck) {
          req.headers["decoded"] = decoded;
          next();
        } else {
          res.status(404);
          res.json({ success: false, message: "User no longer exists" });
        }
      } else {
        console.log(err);
        res.status(403);
        res.json({ success: false, message: "invalid Token" });
      }
    }
  );
};

module.exports = {
  verifyToken,
};
