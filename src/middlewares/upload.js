const multer = require('multer');

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_POST_IMAGES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// files stay in memory and are sent to Cloudinary by the controller,
// so nothing is uploaded if validation fails
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: MAX_POST_IMAGES },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
            const err = new Error('Only JPEG, PNG and WEBP images are allowed');
            err.status = 400;
            return cb(err);
        }
        cb(null, true);
    }
});

const uploadProfilePicture = upload.single('profilePicture');
const uploadPostImages = upload.array('images', MAX_POST_IMAGES);

module.exports = { uploadProfilePicture, uploadPostImages };
