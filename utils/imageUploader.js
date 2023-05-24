const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, hight, quality) => {
  const option = { folder };
  if (hight) {
    option.hight = hight;
  }
  if (quality) {
    option.quality = quality;
  }
  option.resource_type = "auto";

  return await cloudinary.uploader.upload(file.tempFilePath, option);
};
