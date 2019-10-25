const router = require('express').Router();
import Session from './session';
import File from './file';
import User from './user';
import Me from './me';
import Category from './category';

router.use('/session', Session);
router.use('/file', File);
router.use('/user', User);
router.use('/me', Me);
router.use('/category', Category);

export default router;
