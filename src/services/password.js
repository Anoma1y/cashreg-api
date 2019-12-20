import {
  addTimestamp,
  generateCode,
  hashPassword,
  verifyPassword,
} from '../helpers/index';
import DB from '../config/db';
import { redisDelAsync } from '../config/redis';
import { ACTION_CODE_TYPES, ACTION_CODE_EXPIRES, HTTP_STATUS, ACTION_CODE } from '../constants';
import { HttpError } from "../services/errors";
import { Op } from 'sequelize';
import AuthService from './auth';

class PasswordService {
  resetPasswordStepOne = async (email) => {
    const user = await DB.User.findOne({ where: { email } });

    if (!user) {
      throw new HttpError(ACTION_CODE.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const code = generateCode();

    await DB.ActionCodes.create({
      user_id: user.id,
      code,
      type: ACTION_CODE_TYPES.PASSWORD_RESET,
      expires_at: addTimestamp(ACTION_CODE_EXPIRES.PASSWORD_RESET, true)
    });

    console.log(code);

    return true;
  };

  resetPasswordStepTwo = async (userId, token, tokenId, password) => {
    if (!token || !tokenId) {
      throw new HttpError(ACTION_CODE.AUTHORIZATION_TOKEN_NOT_FOUND, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }

    const user = await DB.User.findByPk(userId);
    if (!user) {
      throw new HttpError(ACTION_CODE.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const actionCode = await DB.ActionCodes.findOne({
      where: {
        id: tokenId,
        type: ACTION_CODE_TYPES.PASSWORD_RESET,
        user_id: userId,
        code: token,
        claimed_at: null,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!actionCode) {
      throw new HttpError(ACTION_CODE.VERIFY_TOKEN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
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

    if (!verify) throw new HttpError(ACTION_CODE.INVALID_CURRENT_PASSWORD, HTTP_STATUS.UNAUTHORIZED);

    const oldPasswordMatch = await verifyPassword(newPassword, user.password);

    if (oldPasswordMatch) {
      throw new HttpError(ACTION_CODE.PASSWORD_CHANGE_VALIDATION_OLD, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    await redisDelAsync(sessionKey);

    return await AuthService.genAuthToken(user.id)
  }
};

export default new PasswordService();
