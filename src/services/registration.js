import { Op } from 'sequelize';
import DB, { sequelize } from '../config/db';
import {
  addTimestamp,
  generateCode,
  generateKey,
  hashPassword,
  removeEmpty,
} from '../helpers/index';
import STATUS_CODES from '../helpers/statusCodes';
import { HttpError } from "../helpers/errorHandler";
import ACTION_CODES from '../helpers/actionCodes';
import MailService from './mail';
import { ACTION_CODES_TYPES, ACTION_CODES_EXPIRES } from '../config/constants'

class RegistrationService {

  checkExist = async (email) => {
    const user = await DB.User.findOne({ where: { email } });

    return Boolean(user);
  };
  
  createUser = async (data) => {
    const { email, login, password } = data;
    const checkUser = await this.checkExist(email);

    if (checkUser) {
      throw new HttpError(ACTION_CODES.USER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
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
            type: ACTION_CODES_TYPES.EMAIL_VERIFICATION,
            expires_at: addTimestamp(ACTION_CODES_EXPIRES.EMAIL_VERIFICATION, true)
          },
          {transaction}
        );

        const activationLink = `https://example.test/auth/signup/confirm?user_id=${userCreate.id}&code_id=${actionCode.id}&code=${activationCode}`; // todo add host for confirm email

        MailService.sendMail({
          to: email,
          subject: 'Подтверждение регистрации',
          html: `
            <a href="${activationLink}">Активация аккаунта</a>
            <p>Code: ${activationCode}</p>
            <p>Code ID: ${actionCode.id}</p>
            <p>User ID: ${userCreate.id}</p>
            <p>Actionvation key: ${activationKey}</p>
          `
        });

        await transaction.commit();

        return [userCreate, actionCode];
      } catch (e) {
        await transaction.rollback().then(() => {
          throw new HttpError(ACTION_CODES.USER_CREATED_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
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
        type: ACTION_CODES_TYPES.EMAIL_VERIFICATION,
        claimed_at: null,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!actionCode) {
      throw new HttpError(ACTION_CODES.VERIFY_TOKEN_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (!token && key) {
      const { activationKey } = JSON.parse(actionCode.extra_data);


      if (parseInt(activationKey) !== parseInt(key)) {
        throw new HttpError(ACTION_CODES.ACTIVATION_CODE_DOES_NOT_MATCH, STATUS_CODES.UNPROCESSABLE_ENTITY);
      }
    } else if (token && !key) {
      if (token !== actionCode.code) {
        throw new HttpError(ACTION_CODES.ACTIVATION_CODE_DOES_NOT_MATCH, STATUS_CODES.UNPROCESSABLE_ENTITY);
      }
    }

    const profile = await DB.Profile.findOne({ where: { user_id: userId } });

    if (!profile) {
      throw new HttpError(ACTION_CODES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (profile.is_email_verified) {
      throw new HttpError(ACTION_CODES.USER_EMAIL_ALREADY_VERIFIED, STATUS_CODES.CONFLICT);
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
        throw new HttpError('Err', STATUS_CODES.INTERNAL_SERVER_ERROR);
      });
    }

    return true;
  }
};

export default new RegistrationService();
