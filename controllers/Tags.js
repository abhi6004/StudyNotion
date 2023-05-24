const Tags = require("../models/Tags");
const Tag = require("../models/Tags");

//create a tag handler

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.json({
        success: false,
        message: "all fildes are required",
      });
    }

    //create entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    //return a response
    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAll tags

exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tags.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "all tags get successfully",
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
