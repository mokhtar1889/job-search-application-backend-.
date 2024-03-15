import multer, { diskStorage } from "multer";
export const uploadFile = () => {
  const storage = diskStorage({});
  // fileFilter
  const fileFilter = (req, file, callback) => {
    if (file.mimetype != "application/pdf")
      return callback(new Error("invalid file type", false));

    return callback(null, true);
  };

  const multerReturn = multer({ storage, fileFilter });

  return multerReturn;
};
