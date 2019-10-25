const router = require('express').Router();
import Session from './session';
import File from './file';
import User from './user';
import Me from './me';

router.use('/session', Session);
router.use('/file', File);
router.use('/user', User);
router.use('/me', Me);

export default router;
