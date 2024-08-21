const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const verifyToken = require("../middleware/verifyToken");
require("dotenv").config();

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ error: "All the fields are required" });
  }

  User.findOne({ email: email }).then((found) => {
    if (found) {
      res.json({ error: "User already exists" });
    } else {
      bcrypt.hash(password, 12).then((encrypted) => {
        const user = new User({
          name: name,
          email: email,
          password: encrypted,
        });

        user
          .save()
          .then(() => res.json({success:"Account created"}))
          .catch((err) => res.json({error:"Error occured"}));
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.josn({ error: "All feilds are required!" });
  }
  // compare method
  User.findOne({ email: email }).then((found) => {
    if (found) {
      bcrypt.compare(password, found.password).then((match) => {
        if (match) {
          // Bearer token
          const token = jwt.sign({ id: found._id }, process.env.JWT_SECRET);
          res.json({ token: token , uid: found._id});
        } else {
          res.json({ error: "Invalid credentials" });
        }
      });
    } else {
      res.json({ error: "This account does not exist" });
    }
  });
});
router.get("/profile",verifyToken, (req,res)=>{
  User.findById(req.user.id)
  .then((user)=>{
    if(!user)
    {
      return res.json({error:"User not found"});
    }
    res.json({user:user});
    })
    .catch((err)=>{
      res.json({error:"Error occured"});
      });
})
// user (/profile/adnan)-> middleware(verify user is valid or not) ->next() -> /profile/adnan

// user (/test) -> middleware (verifyToken) ->next() -> /test
router.post("/test", verifyToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
