import {
  addTimestamp,
  generateCode,
  hashPassword,
  verifyPassword,
} from '../helpers/index';
import DB from '../config/db';
import { redisDelAsync } from '../config/redis';
import STATUS_CODES from '../helpers/statusCodes';
import { HttpError } from "../helpers/errorHandler";
import ACTION_CODES from '../helpers/actionCodes';
import { Op } from 'sequelize';
import { ACTION_CODES_TYPES, ACTION_CODES_EXPIRES } from '../config/constants'
import AuthService from './auth';

class PasswordService {
  resetPasswordStepOne = async (email) => {
    const user = await DB.User.findOne({ where: { email } });

    if (!user) {
      throw new HttpError(ACTION_CODES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const code = generateCode();

    await DB.ActionCodes.create({
      user_id: user.id,
      code,
      type: ACTION_CODES_TYPES.PASSWORD_RESET,
      expires_at: addTimestamp(ACTION_CODES_EXPIRES.PASSWORD_RESET, true)
    });

    console.log(code);

    return true;
  };

  resetPasswordStepTwo = async (userId, token, tokenId, password) => {
    if (!token || !tokenId) {
      throw new HttpError(ACTION_CODES.AUTHORIZATION_TOKEN_NOT_FOUND, STATUS_CODES.UNPROCESSABLE_ENTITY);
    }

    const user = await DB.User.findByPk(userId);
    if (!user) {
      throw new HttpError(ACTION_CODES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const actionCode = await DB.ActionCodes.findOne({
      where: {
        id: tokenId,
        type: ACTION_CODES_TYPES.PASSWORD_RESET,
        user_id: userId,
        code: token,
        claimed_at: null,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!actionCode) {
      throw new HttpError(ACTION_CODES.VERIFY_TOKEN_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    user.password = await hashPassword(password);
    await user.save();

    actionCode.claimed_at = +new Date();
    await actionCode.save();

    return true;
  };

  changePassword = async (sessionKey, userId, newPassword, currentPassword) => {
    const user = await DB.User.findByPk(userId);

    const verify = await verifyPassword(currentPassword, user.password);

    if (!verify) throw new HttpError(ACTION_CODES.INVALID_CURRENT_PASSWORD, STATUS_CODES.UNAUTHORIZED);

    const oldPasswordMatch = await verifyPassword(newPassword, user.password);

    if (oldPasswordMatch) {
      throw new HttpError(ACTION_CODES.PASSWORD_CHANGE_VALIDATION_OLD, STATUS_CODES.UNPROCESSABLE_ENTITY);
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    await redisDelAsync(sessionKey);

    return await AuthService.genAuthToken(user.id)
  }
};

export default new PasswordService();
