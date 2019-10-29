import File from '../../controllers/File';
import { checkToken } from '../../middlewares/jwt';
import { digitalOceanfileUploader } from '../../middlewares/aws';
// import Validation from './validation/file';

const router = require('express').Router();

router.post('/', checkToken, digitalOceanfileUploader, File.uploadFile);
router.get('/:file_id', File.getFile);
router.get('/', File.getFiles);
router.delete('/:file_id', checkToken, File.deleteFile);
router.patch('/:file_id', checkToken, File.editFile);

export default router;
