import { Op } from 'sequelize';
import DB, { sequelize } from '../config/db';
import {
  addTimestamp,
  generateCode,
  generateKey,
  hashPassword,
  removeEmpty,
} from '../helpers/index';
import { HttpError } from "../services/errors";
import { ACTION_CODE_TYPES, ACTION_CODE_EXPIRES, HTTP_STATUS, ACTION_CODE } from '../constants';

class RegistrationService {

  checkExist = async (email) => {
    const user = await DB.User.findOne({ where: { email } });

    return Boolean(user);
  };
  
  createUser = async (data) => {
    const { email, login, password } = data;
    const checkUser = await this.checkExist(email);

    if (checkUser) {
      throw new HttpError(ACTION_CODE.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    const hash = await hashPassword(password);

    return await sequelize.transaction().then(async (transaction) => {
      try {
        const userCreate = await DB.User.create(
          {
            login,
            email,
            password: hash
          },
          {transaction}
        );

        await DB.Profile.create(
          {
            user_id: userCreate.id
          },
          {transaction}
        );

        await DB.Settings.create(
          {
            user_id: userCreate.id
          },
          {transaction}
        );

        const activationCode = generateCode();
        const activationKey = generateKey();

        const actionCode = await DB.ActionCodes.create(
          {
            user_id: userCreate.id,
            code: activationCode,
            extra_data: JSON.stringify({ activationKey }),
            type: ACTION_CODE_TYPES.EMAIL_VERIFICATION,
            expires_at: addTimestamp(ACTION_CODE_EXPIRES.EMAIL_VERIFICATION, true)
          },
          {transaction}
        );

        await transaction.commit(); // todo add send registration email after success commit

        return [userCreate, actionCode];
      } catch (e) {
        await transaction.rollback().then(() => {
          throw new HttpError(ACTION_CODE.USER_CREATED_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
      }
    });
  };

  verify = async (userId, data) => {
    const { token, token_id, key } = data;

    const actionCode = await DB.ActionCodes.findOne({
      where: {
        id: token_id,
        user_id: userId,
        type: ACTION_CODE_TYPES.EMAIL_VERIFICATION,
        claimed_at: null,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!actionCode) {
      throw new HttpError(ACTION_CODE.VERIFY_TOKEN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (!token && key) {
      const { activationKey } = JSON.parse(actionCode.extra_data);


      if (parseInt(activationKey) !== parseInt(key)) {
        throw new HttpError(ACTION_CODE.ACTIVATION_CODE_DOES_NOT_MATCH, HTTP_STATUS.FORBIDDEN);
      }
    } else if (token && !key) {
      if (token !== actionCode.code) {
        throw new HttpError(ACTION_CODE.ACTIVATION_CODE_DOES_NOT_MATCH, HTTP_STATUS.FORBIDDEN);
      }
    }

    const profile = await DB.Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      throw new HttpError(ACTION_CODE.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (profile.is_email_verified) {
      throw new HttpError(ACTION_CODE.USER_EMAIL_ALREADY_VERIFIED, HTTP_STATUS.CONFLICT);
    }

    const transaction = await sequelize.transaction();

    try {
      profile.is_email_verified = true;
      await profile.save({ transaction });

      actionCode.claimed_at = +new Date();
      await actionCode.save({ transaction });

      await transaction.commit();
    } catch (e) {
      await transaction.rollback().then(() => {
        throw new HttpError('Err', HTTP_STATUS.INTERNAL_SERVER_ERROR);
      });
    }

    return true;
  };

  resendEmailVerify = async (user_id, token_id) => {
    const actionCodeOld = await DB.ActionCodes.findOne({
      where: {
        id: token_id,
        user_id,
        type: ACTION_CODE_TYPES.EMAIL_VERIFICATION,
        claimed_at: null,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!actionCodeOld) {
      throw new HttpError(ACTION_CODE.VERIFY_TOKEN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const user = await DB.User.findByPk(user_id, {
      attributes: ['id', 'email'],
      plain: true,
    }); // todo add condition

    return await sequelize.transaction().then(async (transaction) => {
      try {
        const activationCode = generateCode();
        const activationKey = generateKey();

        const actionCode = await DB.ActionCodes.create(
          {
            user_id,
            code: activationCode,
            extra_data: JSON.stringify({ activationKey }),
            type: ACTION_CODE_TYPES.EMAIL_VERIFICATION,
            expires_at: addTimestamp(ACTION_CODE_EXPIRES.EMAIL_VERIFICATION, true)
          },
          {transaction}
        );

        actionCodeOld.claimed_at = +new Date();
        await actionCodeOld.save({ transaction });

        await transaction.commit();

        return [user, actionCode];
      } catch (e) {
        await transaction.rollback().then(() => {
          throw new HttpError(ACTION_CODE.USER_CREATED_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
      }
    });
  }
}

export default new RegistrationService();
