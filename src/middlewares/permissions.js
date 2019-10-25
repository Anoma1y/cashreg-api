import STATUS_CODES from '../helpers/statusCodes'

class Permissions {

  static error = (res) => res.status(STATUS_CODES.FORBIDDEN).send();

  static can = (permission) => async (req, res, next) => {
    console.log(permission)
    next();
  };
}

export default Permissions;
