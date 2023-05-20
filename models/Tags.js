const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: Number,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    require: true,
  },
});

module.exports = mongoose.model("Tag", tagsSchema);
