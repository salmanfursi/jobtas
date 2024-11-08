const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const cors = require('cors');
const stream = require('stream');
const path = require('path');

const app = express();
app.use(cors());

   const corsOptions = {
    origin: ['http://localhost:5173','https://vite-project-hvxyp1hph-salmanfursis-projects.vercel.app'],
    credentials: true, 
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
   };

app.options('*', cors(corsOptions));


app.use(cors(corsOptions));

 // Connect to MongoDB
mongoose.connect(`mongodb+srv://jobtask:9JcOhdEXplIJCezo@momsyummy.fexfrtg.mongodb.net/?retryWrites=true&w=majority&appName=momsYummy`)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
  console.log("GridFSBucket setup complete.");
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', async (req, res) => {
    res.send('its running----------->');
});
// API to upload files
app.post('/upload/:taskId', upload.array('files'), async (req, res) => {
  const { taskId } = req.params;
  const files = req.files;

  try {
    const fileUploadPromises = files.map(file => {
      const readableStream = new stream.Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      return new Promise((resolve, reject) => {
        const uploadStream = gfsBucket.openUploadStream(file.originalname, {
          metadata: { taskId, extension: path.extname(file.originalname), contentType: file.mimetype }
        });
        readableStream.pipe(uploadStream)
          .on('error', (error) => {
            console.error("Error during file upload:", error);
            reject(error);
          })
          .on('finish', () => {
            console.log(`File ${file.originalname} uploaded successfully.`);
            resolve(uploadStream.id);
          });
      });
    });

    const fileIds = await Promise.all(fileUploadPromises);
    res.json({ message: 'Files uploaded successfully', fileIds });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// API to get file count for a task
app.get('/file-count/:taskId', async (req, res) => {
  try {
    const fileCount = await gfsBucket.find({ 'metadata.taskId': req.params.taskId }).count();
    console.log('filecount',fileCount)
    res.json({ fileCount });
  } catch (error) {
    console.error("Error fetching file count:", error);
    res.status(500).json({ error: 'Failed to fetch file count' });
  }
});

// API to retrieve metadata (name and extension) of files for a task
app.get('/files/:taskId', async (req, res) => {
  try {
    const files = await gfsBucket.find({ 'metadata.taskId': req.params.taskId }).toArray();
    const fileMetadata = files.map(file => ({
      id: file._id,
      name: file.filename,
      extension: file.metadata.extension
    }));
    res.json(fileMetadata);
  } catch (error) {
    console.error("Error fetching files metadata:", error);
    res.status(500).json({ error: 'Failed to fetch files metadata' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
