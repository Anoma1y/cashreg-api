import Contragent from '../../../controllers/Contragent';
import { checkToken } from '../../../middlewares/jwt';
import Validation from '../validation/contragent'
import Permissions from '../../../middlewares/permissions';

const router = require('express').Router({ mergeParams: true, });

router.get('/',
	checkToken,
	Permissions.can(),
	Contragent.getContragentList,
);

router.get('/:contragent_id',
	checkToken,
	Permissions.can(),
	Contragent.getContragentSingle
);

router.post('/',
	checkToken,
	Permissions.can('contragent_create'),
	Validation.createContragent,
	Contragent.createContragent
);

router.delete('/:contragent_id',
	checkToken,
	Permissions.can('contragent_delete'),
	Contragent.deleteContragent
);

router.patch('/:contragent_id',
	checkToken,
	Permissions.can('contragent_edit'),
	Validation.editContragent,
	Contragent.editContragent
);

export default router;
