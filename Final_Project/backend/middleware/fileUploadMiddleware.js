// middleware/fileUploadMiddleware.js
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// إعداد مجلد التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // تحديد المجلد حسب نوع الملف
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
      uploadFolder = path.join(__dirname, '../uploads/avatars');
    } else if (file.fieldname === 'assignment') {

      uploadPath += 'assignments/';
    uploadFolder = path.join(__dirname, '../uploads/assignments');
    } else if (file.fieldname === 'courseThumbnail') {
      uploadPath += 'thumbnails/';
    uploadFolder = path.join(__dirname, '../uploads/thumbnails');
    } else {
      uploadPath += 'misc/';
            uploadFolder = path.join(__dirname, '../uploads/misc');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // توليد اسم فريد للملف
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// فلترة أنواع الملفات
const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    avatar: ['image/jpeg', 'image/png', 'image/gif'],
    courseThumbnail: ['image/jpeg', 'image/png', 'image/gif'],
    assignment: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'text/plain',
      'application/javascript',
      'text/html',
      'text/css'
    ]
  };

  const allowedTypes = allowedMimes[file.fieldname] || allowedMimes.assignment;
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// إعدادات Multer
export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
}).single('avatar');

export const uploadAssignment = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
}).single('assignment');

export const uploadCourseThumbnail = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
}).single('courseThumbnail');

// Middleware للتعامل مع أخطاء الرفع
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};