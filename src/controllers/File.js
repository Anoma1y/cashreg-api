import DB from '../config/db';
import { Op } from 'sequelize';
import ACTION_CODES from "../helpers/actionCodes";
import { HttpError, setResponseError } from "../helpers/errorHandler";
import STATUS_CODES from "../helpers/statusCodes";

class File {
  uploadFile = async (req, res) => {
    try {
      const { file } = req;

      if (!file) {
        return setResponseError(res, {
          action: ACTION_CODES.FILE_UPLOAD_NOT_FOUND,
          status: STATUS_CODES.UNPROCESSABLE_ENTITY,
          extra: {}
        })
      }

      let fileData = {};

      if (file.hasOwnProperty('transforms')) {
        const original = file.transforms.find(f => f.id === 'original');
        const preview = file.transforms.find(f => f.id === 'preview');

        fileData = {
          original_name: original.key.split('/').pop(),
          extension: file.mimetype,
          size: original.size,
          original_uri: original.location,
          preview_uri: preview.location,
        };
      } else {
        fileData = {
          original_name: file.key.split('/').pop(),
          extension: file.mimetype,
          size: file.size,
          original_uri: file.location,
          preview_uri: null,
        };
      }

      const createFile = await DB.File.create(fileData);

      return res.status(STATUS_CODES.OK).json(createFile)
    } catch (err) {
      return setResponseError(res, err);
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
