import {
  setResponseError,
  checkValidationErrors
} from "../services/errors";
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import RegistrationService from '../services/registration';
import PasswordService from '../services/password';
import MailService from '../services/mail';

class User {
  checkEmailExist = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { email } = req.query;

      const isExist = await RegistrationService.checkExist(email);

      return res.status(isExist ? HTTP_STATUS.CONFLICT : HTTP_STATUS.OK).send()
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createUser =  async (req, res) => {
    try {
      await checkValidationErrors(req);
      
      const { login, email, password } = req.body;
      
      const [userCreate, actionCodeCreate] = await RegistrationService.createUser({ email, login, password });

      MailService.sendRegistrationMail({
        email: userCreate.email,
        user_id: userCreate.id,
        token_id: actionCodeCreate.id,
        token: actionCodeCreate.code,
        key: JSON.parse(actionCodeCreate.extra_data).activationKey
      });

      return res.status(HTTP_STATUS.CREATED).json({
        action: ACTION_CODE.USER_CREATED,
        id: userCreate.id,
        token_id: actionCodeCreate.id
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

	resendMail = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { user_id } = req.params;
      const { token_id } = req.body;

      const [user, actionCodeCreate] = await RegistrationService.resendEmailVerify(user_id, token_id);

      MailService.sendRegistrationMail({
        email: user.email,
        user_id: user.id,
        token_id: actionCodeCreate.id,
        token: actionCodeCreate.code,
        key: JSON.parse(actionCodeCreate.extra_data).activationKey
      });

      return res.status(HTTP_STATUS.OK).json({
        action: ACTION_CODE.EMAIL_SEND,
        id: user.id,
        token_id: actionCodeCreate.id
      });
    } catch (err) {
      return setResponseError(res, err)
    }
	};

  userVerify = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { user_id } = req.params;
      const { token, token_id, key } = req.body;

      await RegistrationService.verify(user_id, { token, token_id, key });

      return res.status(HTTP_STATUS.OK).json({
        action: ACTION_CODE.VERIFY_SUCCESS
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  resetPasswordStepOne = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { email } = req.query;

      await PasswordService.resetPasswordStepOne(email);

      return res.status(HTTP_STATUS.CREATED).json({
        action: ACTION_CODE.PASSWORD_RESET_SEND_EMAIL
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  resetPasswordStepTwo = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { user_id } = req.params;
      const { token, token_id, password } = req.body;

      await PasswordService.resetPasswordStepTwo(user_id, token, Number(token_id), password );

      return res.status(HTTP_STATUS.CREATED).json({
        action: ACTION_CODE.PASSWORD_RESET_SUCCESSFUL
      })
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  changePassword = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { newPassword, currentPassword } = req.body;
      const { sessionKey, userId } = req.decoded;

      const data = await PasswordService.changePassword(sessionKey, userId,  newPassword, currentPassword );

      return res.status(HTTP_STATUS.CREATED).json({
        action: ACTION_CODE.PASSWORD_CHANGE_SUCCESSFUL,
        data
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  }
}

export default new User();
