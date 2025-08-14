// Stream file for image preview (no attachment)
exports.viewFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    const decryptedBuffer = await decryptFile(file.filePath, file.encryptionKey);
    res.setHeader('Content-Type', file.mimeType);
    res.send(decryptedBuffer);
  } catch (error) {
    console.error('View file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
const File = require('../models/File');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
}).single('file');

// Generate encryption key
const generateEncryptionKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Encrypt file
const encryptFile = async (filePath, keyHex) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(16);

  const fileBuffer = await fs.readFile(filePath);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);

  // Save encrypted file with IV prepended
  const encryptedPath = filePath + '.encrypted';
  const dataToSave = Buffer.concat([iv, encrypted]); // IV + CipherText
  await fs.writeFile(encryptedPath, dataToSave);

  await fs.unlink(filePath);
  return encryptedPath;
};


// Decrypt file
const decryptFile = async (filePath, keyHex) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(keyHex, 'hex');

  const fileBuffer = await fs.readFile(filePath);
  const iv = fileBuffer.slice(0, 16); // First 16 bytes
  const encryptedText = fileBuffer.slice(16); // Remainder

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

  return decrypted;
};


// Upload file
exports.uploadFile = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const userId = req.user._id; // Assuming you have user info from auth middleware
      const encryptionKey = generateEncryptionKey();
      
      // Encrypt the file
      const encryptedPath = await encryptFile(req.file.path, encryptionKey);
      
      // Create file record
      const file = new File({
        userId,
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: encryptedPath,
        size: req.file.size,
        mimeType: req.file.mimetype,
        encryptionKey,
        passwordProtected: req.body.passwordProtected === 'true'
      });
      
      await file.save();
      
      res.status(201).json({
        message: 'File uploaded and encrypted successfully',
        file: {
          id: file._id,
          name: file.originalName,
          size: file.size,
          encrypted: file.encrypted,
          passwordProtected: file.passwordProtected,
          uploadDate: file.uploadDate
        }
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's files
exports.getFiles = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search } = req.query;
    
    let query = { userId };
    
    // Search by filename
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }
    
    const files = await File.find(query).sort({ uploadDate: -1 });
    
    const filesWithFormattedData = files.map(file => ({
      id: file._id,
      name: file.originalName,
      size: formatFileSize(file.size),
      encrypted: file.encrypted,
      passwordProtected: file.passwordProtected,
      uploadDate: file.uploadDate.toISOString().split('T')[0]
    }));
    
    res.json(filesWithFormattedData);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Download file
exports.downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;
    
    const file = await File.findOne({ _id: fileId, userId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Decrypt file
    const decryptedBuffer = await decryptFile(file.filePath, file.encryptionKey);
    
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.send(decryptedBuffer);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;
    
    const file = await File.findOne({ _id: fileId, userId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Delete physical file
    try {
      await fs.unlink(file.filePath);
    } catch (err) {
      console.error('File deletion error:', err);
    }
    
    // Delete database record
    await File.findByIdAndDelete(fileId);
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get storage stats
exports.getStorageStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const files = await File.find({ userId });
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    res.json({
      totalFiles: files.length,
      totalSize: formatFileSize(totalSize),
      maxStorage: '5 GB'
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}; 