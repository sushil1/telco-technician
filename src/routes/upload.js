import { Router } from 'express';
import AWS from 'aws-sdk';
import uuid from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import fs from 'fs';

const router = new Router();

dotenv.config({
  path: path.join(__dirname, '../.env')
});

const s3BucketConfig = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.BUCKET_NAME,
  signatureVersion: 'v4',
  region: 'ap-southeast-2'
});

router.get('/getsignedurl', (req, res) => {
  console.log(req.query);
  const filename = req.query.filename;
  const filetype = req.query.filetype;
  let params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuid.v4()}-${filename}`,
    ContentType: filetype,
    ACL: 'public-read'
  };
  s3BucketConfig.getSignedUrl('putObject', params, function(err, signedURL) {
    if (err) {
      console.log('error', err);
      res.status(400).json(err);
    }
    const awsUrl = {
      postURL: signedURL,
      getURL: signedURL.split('?')[0]
    };
    res.status(200).json(awsUrl);
  });
});

function getSignedURL(req, res, next) {
  let params = {
    Bucket: process.env.BUCKET_NAME,
    Key: uuid.v4(),
    Expires: 200,
    ContentType: 'image/jpeg'
  };

  s3BucketConfig.getSignedUrl('putObject', params, function(err, signedURL) {
    if (err) {
      console.log('error', err);
      return next(err);
    }
    const awsUrl = {
      postURL: signedURL,
      getURL: signedURL.split('?')[0]
    };
    req.uploadUrl = awsUrl;
    next();
  });
}

const uploadToS3 = multer({
  storage: multerS3({
    s3: s3BucketConfig,
    bucket: process.env.BUCKET_NAME,
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      const newFilename = `${
        path.basename(file.originalname).split('.')[0]
      }-${uuid.v4()}${path.extname(file.originalname)}`;
      cb(null, newFilename);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  })
});

// {const item = req.body;
//   const upload = multer({
//     storage: multerS3({
//       s3: s3BucketConfig,
//       bucket: process.env.BUCKET_NAME,
//       metadata: function(req, file, cb) {
//         cb(null, { fieldName: file.fieldname });
//       },
//       key: function(req, file, cb) {
//         cb(null, uuid.v4());
//       }
//     })
//   });
// }

router.post('/', uploadToS3.single('avatar'), (req, res) => {
  res.json('success uploaded');
});

// const storage = multer.diskStorage({
//   destination: req.uploadUrl.postURL,
//   filename: (req, file, cb) => {
//     const newFilename = `${uuid.v4()}${path.extname(file.originalname)}`;
//     cb(null, req.uploadUrl.getURL);
//   }
// });

// const upload = multer({ storage: storage });

// router.post('/', getSignedURL, upload.single('avatar'), (req, res) => {
//   console.log('uploaded');
//   res.send(req.uploadUrl.getURL);
// });

// function uploadToS3 = (req, res) => {
//   let params = {
//     Bucket: process.env.BUCKET_NAME,
//     Key: file.name,
//     Body: file.data
//   };
//   s3BucketConfig.upload(params, function(err, data) {
//     if (err) {
//       console.log('errore happened', err);
//     }
//     console.log('success', data);
//   });
// }

export default router;
