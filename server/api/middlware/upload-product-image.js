const multer = require('multer');
const path = require('path')

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) { 
    cb(null, 'uploads/'); // Set the destination where files should be saved
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Set the file name
  }
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Set file size limit to 1MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); // 'image' is the name of the input field in the form

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Middleware to upload image
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      if (req.file == undefined) {
        res.status(400).send({ msg: 'No file selected!' });
      } else {
        next(); // Proceed to the next middleware or request handler
      }
    }
  });
};

module.exports = uploadMiddleware;