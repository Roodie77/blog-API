// the SDK configures itself from the CLOUDINARY_URL env variable
const cloudinary = require('cloudinary').v2;

const uploadImage = (file, folder) =>
    new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: `blog-api/${folder}`, resource_type: 'image' }, (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            })
            .end(file.buffer);
    });

const uploadImages = async (files = [], folder) => {
    const results = await Promise.allSettled(files.map((f) => uploadImage(f, folder)));
    const uploaded = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
    const failed = results.find((r) => r.status === 'rejected');
    if (failed) {
        // don't leave half a post's images behind on Cloudinary
        await deleteImages(uploaded);
        throw failed.reason;
    }
    return uploaded;
};

const deleteImages = async (images = []) => {
    await Promise.all(
        images
            .filter((img) => img && img.publicId)
            .map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => {}))
    );
};

module.exports = { uploadImage, uploadImages, deleteImages };
