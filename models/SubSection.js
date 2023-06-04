const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    trim: true,
  },  
});

module.exports = mongoose.model("SubSection", subSectionSchema);
