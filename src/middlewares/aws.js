import Config from '../config';
import { generateFileName } from '../helpers';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3-transform';
import sharp from 'sharp';

const endpoint = new AWS.Endpoint('https://fra1.digitaloceanspaces.com');

const s3 = new AWS.S3({
	endpoint,
	accessKeyId: Config.DIGITAL_OCEAN_SPACES_ACCESS_KEY,
	secretAccessKey: Config.DIGITAL_OCEAN_SPACES_SECRET_KEY,
});

export const digitalOceanfileUploader = multer({
	storage: multerS3({
		s3: s3,
		bucket: Config.DIGITAL_OCEAN_SPACES_BUCKET_NAME,
		acl: "public-read",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: function (req, file, cb) {
			cb(null, generateFileName(file.originalname))
		},
		shouldTransform: function (req, file, cb) {
			cb(null, /^image/i.test(file.mimetype))
		},
		transforms: [{
			id: 'original',
			key: function (req, file, cb) {
				cb(null, generateFileName(file.originalname))
			},
			transform: function (req, file, cb) {
				cb(null, sharp())
			}
		}, {
			id: 'preview',
			key: function (req, file, cb) {
				cb(null, generateFileName(file.originalname, 'preview'))
			},
			transform: function (req, file, cb) {
				cb(null, sharp().resize(200))
			}
		}],
	}),
	limits: { fileSize: 3000000 },
}).single("file");
