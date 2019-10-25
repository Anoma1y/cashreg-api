import {
  hashPassword,
} from '../helpers/index';
import DB, { sequelize } from '../config/db';
import STATUS_CODES from '../helpers/statusCodes';
import { HttpError } from "../helpers/errorHandler";
import ACTION_CODES from '../helpers/actionCodes';

class RegistrationService {
  checkExist = async (email) => {
    const user = await DB.User.findOne({ where: { email } });
    
    return Boolean(user);
  };
  
  createUser = async (data) => {
    const { email, login, password } = data;
    const user = await DB.User.findOne({ where: { email } });

    if (user) {
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

        await transaction.commit();

        return userCreate.get('id');
      } catch (e) {
        await transaction.rollback().then(() => {
          throw new HttpError(ACTION_CODES.USER_CREATED_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
        });
      }
    });
  };
};

export default new RegistrationService();
