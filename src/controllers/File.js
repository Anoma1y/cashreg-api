import DB from '../config/db';
import { Op } from 'sequelize';
import ACTION_CODES from "../helpers/actionCodes";
import { HttpError, setResponseError } from "../helpers/errorHandler";
import { generateFileName, getFileNameExt, uploadFile } from '../helpers';
import STATUS_CODES from "../helpers/statusCodes";

const FILE_LIMIT = 4;
const AVAILABLE_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const isUploadedFile = (file) => typeof file === 'object' && file.name !== undefined;

class File {
  uploadFile = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return setResponseError(res, {
          action: ACTION_CODES.FILE_UPLOAD_NOT_FOUND,
          status: STATUS_CODES.UNPROCESSABLE_ENTITY,
          extra: {}
        })
    }

    if (typeof req.files === 'object') {
      const fileField = req.files.file;
      const fileSize = fileField.data.length;

      if (isUploadedFile(fileField)) {
        if (!AVAILABLE_MIMETYPES.includes(fileField.mimetype)) {
          return setResponseError(res, {
            action: ACTION_CODES.FILE_TYPE_NOT_SUPPORTED,
            status: STATUS_CODES.UNPROCESSABLE_ENTITY,
            extra: {}
          })
        }

        if (fileSize > FILE_LIMIT * 1024 * 1024) {
          return setResponseError(res, {
            action: ACTION_CODES.FILE_TOO_BIG,
            status: STATUS_CODES.UNPROCESSABLE_ENTITY,
            extra: {}
          })
        }

        const fileExtension = getFileNameExt(fileField.name);
        const fileName = generateFileName();
        const fileFullName = `${fileName}.${fileExtension}`;
        const originalURI = '/uploads/' + fileFullName;
        const uploadPath = process.cwd() + originalURI;

        try {
          await uploadFile(fileField, uploadPath);

          const fileCreate = await DB.File.create({
            original_name: fileName,
            extension: fileExtension,
            size: fileSize,
            original_uri: originalURI,
            preview_uri: originalURI, // todo добавить сжатие/уменьшение размеров
          });

          return res.status(STATUS_CODES.CREATED).json({
            action: ACTION_CODES.FILE_UPLOAD,
            data: fileCreate
          });
        } catch (err) {
          return setResponseError(res, err);
        }

      }
    }
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
