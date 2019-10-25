const router = require('express').Router();
import api from './api';

router.use('/api', api);

export default router;
