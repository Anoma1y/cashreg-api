import Permission from '../../controllers/Permission';
import { checkToken } from '../../middlewares/jwt';

const router = require('express').Router();

router.get('/', checkToken, Permission.getList);

export default router;
