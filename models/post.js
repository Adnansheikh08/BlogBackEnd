const mongoose = require("mongoose");
// user details -> name,email, _id, other-> date, content
// populating using references in mongo
const post = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", post);
