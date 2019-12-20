import DB from '../config/db';
import { errorFormatter, HttpError, setResponseError, setResponseErrorValidation } from "../services/errors";
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import { validationResult } from 'express-validator';

class Me {
  getMe = async (req, res) => {
    const { userId } = req.decoded;

    try {
      const user = await DB.User.findByPk(userId, {
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: DB.Profile,
          attributes: {
            exclude: ['avatar_id', 'created_at', 'user_id']
          },
          include: [{
            model: DB.File,
            as: 'avatar'
          }]
        }, {
          model: DB.Settings,
          as: 'settings',
          attributes: {
            exclude: ['created_at', 'id', 'user_id']
          },
        }]
      });

      if (!user) {
        throw new HttpError(ACTION_CODE.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
      }

      res.status(HTTP_STATUS.OK).json({
        ...user.toJSON(),
      });
    } catch (e) {
      setResponseError(res, {
        action: ACTION_CODE.UNKNOWN_ERROR,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      });
    }
  };

  changeMe = async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      return setResponseErrorValidation(res, {
        errors: errors.array({ onlyFirstError: true }),
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }
    console.log(req.body)
  }
}

export default new Me();
