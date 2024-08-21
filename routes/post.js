const verifyToken = require("../middleware/verifyToken");
const Post = require("../models/post");

const router = require("express").Router();

router.post("/create-blog", verifyToken, (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.json({ error: "All feilds are required!" });
  }

  const post = new Post({
    user: req.user.id,
    content: content,
    date: new Date(),
  });

  post
    .save()
    .then(() => res.json({ success: "Blog created" }))
    .catch((err) => res.json(err));
});

router.post("/all-blogs", (req, res) => {
  Post.find()
     .populate("user")
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});
router.post("/my-posts", verifyToken, (req,res)=>{
  Post.find({user:req.user.id})
  .populate("user")
  .then((data)=>res.json(data))
  .catch((err)=>res.json(err))
})

router.post("/delete-blog/:id", (req, res) => {
  const { id } = req.params; 
  Post.findByIdAndDelete(id)
  .then(() => res.json({ success: "Post deleted" }))
  .catch((err) => res.json(err));  
});


router.post("/update-post/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  Post.updateOne(
    { _id: id },
    {
      $set: {
        content: content,
      },
    }
  )
    .then(() => res.json({ success: "Updated successfully" }))
    .catch((err) => res.json({ error: err }));
});

module.exports = router;
