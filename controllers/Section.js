const Section = require("../models/SubSection");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;

    //data validation
    if (!sectionName || !courseId) {
      return res.status(500).json({
        success: false,
        message: "Missing Properties",
      });
    }

    //create a section
    const newSection = await Section.create({ sectionName });

    //update a course with objectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { courseId },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    //return response

    return res.status(200).json({
      success: true,
      message: "section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {}
};
