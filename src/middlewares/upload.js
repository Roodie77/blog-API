const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_POST_IMAGES = 5;
const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads');

const ALLOWED_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

const createUploader = (folder) => {
    const dir = path.join(UPLOAD_ROOT, folder);
    fs.mkdirSync(dir, { recursive: true });

    return multer({
        storage: multer.diskStorage({
            destination: dir,
            // extension comes from the validated mimetype, never the client filename
            filename: (req, file, cb) =>
                cb(null, `${crypto.randomUUID()}${ALLOWED_TYPES[file.mimetype]}`)
        }),
        limits: { fileSize: MAX_FILE_SIZE, files: MAX_POST_IMAGES },
        fileFilter: (req, file, cb) => {
            if (!ALLOWED_TYPES[file.mimetype]) {
                const err = new Error('Only JPEG, PNG and WEBP images are allowed');
                err.status = 400;
                return cb(err);
            }
            cb(null, true);
        }
    });
};

const uploadProfilePicture = createUploader('avatars').single('profilePicture');
const uploadPostImages = createUploader('posts').array('images', MAX_POST_IMAGES);

const removeFiles = async (files = []) => {
    await Promise.all(
        files.map((f) => fs.promises.unlink(f.path || f).catch(() => {}))
    );
};

module.exports = { uploadProfilePicture, uploadPostImages, removeFiles, UPLOAD_ROOT };
