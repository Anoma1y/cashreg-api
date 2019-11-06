import STATUS_CODES from '../helpers/statusCodes';
import {
  setResponseError,
  checkValidationErrors
} from "../helpers/errorHandler";
import ACTION_CODES from '../helpers/actionCodes';
import RegistrationService from '../services/registration';
import PasswordService from '../services/password';
import MailService from '../services/mail';

class User {
  checkEmailExist = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { email } = req.query;

      const isExist = await RegistrationService.checkExist(email);

      return res.status(isExist ? STATUS_CODES.CONFLICT : STATUS_CODES.OK).send()
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

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.USER_CREATED,
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

      return res.status(STATUS_CODES.OK).json({
        action: ACTION_CODES.EMAIL_SEND
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

      return res.status(STATUS_CODES.OK).json({
        action: ACTION_CODES.VERIFY_SUCCESS
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

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.PASSWORD_RESET_SEND_EMAIL
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

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.PASSWORD_RESET_SUCCESSFUL
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

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.PASSWORD_CHANGE_SUCCESSFUL,
        data
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  }
}

export default new User();
