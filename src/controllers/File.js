import DB from '../config/db';
import Config from '../config';
import { Op } from 'sequelize';
import ACTION_CODES from "../helpers/actionCodes";
import { HttpError, setResponseError } from "../helpers/errorHandler";
import { generateFileName, getFileNameExt } from '../helpers';
import STATUS_CODES from "../helpers/statusCodes";
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const endpoint = new AWS.Endpoint('https://fra1.digitaloceanspaces.com');

const s3 = new AWS.S3({
  endpoint,
  accessKeyId: Config.DIGITAL_OCEAN_SPACES_ACCESS_KEY,
  secretAccessKey: Config.DIGITAL_OCEAN_SPACES_SECRET_KEY,
});

const fileUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: Config.DIGITAL_OCEAN_SPACES_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      const { originalname } = file;

      const fileExtension = getFileNameExt(originalname);
      const fileName = generateFileName(originalname);
      const fileFullName = `${fileName}.${fileExtension}`;
      const filePath = `cashreg/uploads/transactions/${fileFullName}`;

      cb(null, filePath);
    },
  }),
  limits: { fileSize: 3000000 },
}).single("file");


class File {
  uploadFile = (req, res) => {

    fileUploader(req, res, async err => {
      if (err) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          action: ACTION_CODES.FILE_UPLOAD_ERROR
        })
      }

      try {
        const { file } = req;

        const createFile = await DB.File.create({
          original_name: file.key.split('/').pop(),
          extension: file.contentType,
          size: file.size,
          original_uri: file.location,
          preview_uri: file.location,
        });

        return res.status(STATUS_CODES.OK).json(createFile)
      } catch (e) {
        return setResponseError(res, err);
      }
    });
  };

  getFile = async (req, res) => {
    const { file_id } = req.params;

    try {
      const file = await DB.File.findByPk(file_id);

      if (!file) {
        throw new HttpError(ACTION_CODES.FILE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }

      return res.status(STATUS_CODES.OK).json({
        data: file
      })
    } catch (err) {
      return setResponseError(res, err);
    }

  };

  getFiles = async (req, res) => {
    const { ids } = req.query;

    try {
      const condition = ids && {
        where: {
          id: {
            [Op.in]: ids.replace(/\s/g, '').split(',')
          }
        }
      };

      if (!condition) {
        throw new HttpError(ACTION_CODES.UNKNOWN_ERROR, STATUS_CODES.UNPROCESSABLE_ENTITY);
      }

      const files = await DB.File.findAll({ ...condition });

      if (!files) {
        throw new HttpError(ACTION_CODES.FILES_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }

      return res.status(STATUS_CODES.OK).json({
        data: [...files]
      })

    } catch (err) {
      return setResponseError(res, err);
    }
  };

  deleteFile = async (req, res) => {
    const { file_id } = req.params;

    try {
      const fileDelete = await DB.File.destroy({ where: { id: file_id } });

      if (fileDelete === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      return res.status(STATUS_CODES.NO_CONTENT).send();
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  editFile = async (req, res) => {
    res.send('test');
  };
}

export default new File();
