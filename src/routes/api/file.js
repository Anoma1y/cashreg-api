import File from '../../controllers/File';
import { checkToken } from '../../middlewares/jwt';

const router = require('express').Router();

router.post('/', checkToken, File.uploadFile);
router.get('/:file_id', File.getFile);
router.get('/', File.getFiles);
router.delete('/:file_id', checkToken, File.deleteFile);
router.patch('/:file_id', checkToken, File.editFile);

export default router;
