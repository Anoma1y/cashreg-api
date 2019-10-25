import DB from '../config/db';
import { errorFormatter, HttpError, setResponseError, setResponseErrorValidation } from "../helpers/errorHandler";
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import { validationResult } from 'express-validator/check';

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
            exclude: ['avatar_id', 'created_at']
          },
          include: [{
            model: DB.File
          }]
        }]
      });

      if (!user) {
        throw new HttpError(ACTION_CODES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND)
      }

      res.status(STATUS_CODES.OK).json({
        data: user
      });
    } catch (e) {
      setResponseError(res, {
        action: ACTION_CODES.UNKNOWN_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR
      });
    }
  };

  changeMe = async (req, res) => {
    const { userId } = req.decoded;

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
      return setResponseErrorValidation(res, {
        errors: errors.array({ onlyFirstError: true }),
        status: STATUS_CODES.UNPROCESSABLE_ENTITY
      })
    }
    console.log(req.body)
  }
}

export default new Me();
