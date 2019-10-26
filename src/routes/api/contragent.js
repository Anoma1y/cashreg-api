import Contragent from '../../controllers/Contragent';
import { checkToken } from '../../middlewares/jwt';
import Validation from './validation/contragent'

const router = require('express').Router();

router.get('/', checkToken, Contragent.getContragentList);
router.get('/:contragent_id', checkToken, Contragent.getContragentSingle);
router.post('/', checkToken, Validation.createContragent, Contragent.createContragent);
router.delete('/:contragent_id', checkToken, Contragent.deleteContragent);
router.patch('/:contragent_id', checkToken, Validation.editContragent, Contragent.editContragent);

export default router;
