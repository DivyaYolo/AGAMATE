import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    const allowedExtensions = [".pdf", ".docx", ".txt"];

    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        return callback(
            new Error("Only PDF, DOCX and TXT files are allowed.")
        );
    }

    callback(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

export default upload;