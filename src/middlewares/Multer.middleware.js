import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

// if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpeg") {
//   //conditon rendering
//   cb(null, "./public/temp");
// } else {
//   cb(null, "./public/temp");
// }
