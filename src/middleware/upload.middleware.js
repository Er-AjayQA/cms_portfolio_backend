const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsRoot = path.join(__dirname, "../../uploads/projects");

fs.mkdirSync(uploadsRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsRoot);
  },
  filename: (_req, file, cb) => {
    const sanitizedName = file.originalname.replace(/\s+/g, "-");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    return cb(null, true);
  }

  return cb(new Error("Only image and video uploads are allowed."));
};

const uploadProjectMedia = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
}).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "media", maxCount: 20 },
]);

module.exports = {
  uploadProjectMedia,
};
