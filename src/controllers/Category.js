import {
  setResponseError,
  checkValidationErrors,
} from "../services/errors";
import { HTTP_STATUS, ACTION_CODE } from '../constants';
import { getWhere } from '../helpers/sql';
import { removeEmpty } from '../helpers';
import CategoryService from '../services/category';
import StructuredDataService from '../services/structuredData';

class Category {
  static CategoryData = (req) => removeEmpty({
    name: req.body.name,
    description: req.body.description,
    parent_id: req.body.description,
    type: req.body.type,
  });

  getCategoryList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;

      const where = getWhere(
        req.query,
        {
          queryList: ['type', 'search'],
          maybeMultipleQuery: ['type'],
        }
      );

      if (req.query.parent_id) {
        where['id'] = req.query.parent_id;
      } else {
        where['parent_id'] = null;
      }

      where['workspace_id'] = workspace_id;

      const data = await StructuredDataService.withoutPagination(req, where, CategoryService.getList);

      return res.status(HTTP_STATUS.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getCategorySingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id, category_id } = req.params;

      const data = await CategoryService.getSingle(category_id, workspace_id, { json: true, });

      if (!data) {
        return res.status(HTTP_STATUS.NOT_FOUND).send();
      }

      return res.status(HTTP_STATUS.OK).json(data);

    } catch (err) {
      console.log(err)
      return setResponseError(res, err)
    }
  };

  createCategory = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const createCategory = await CategoryService.create(Category.CategoryData(req));

      return res.status(HTTP_STATUS.CREATED).json({
        action: ACTION_CODE.CATEGORY_CREATED,
        data: createCategory,
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  deleteCategory = async (req, res) => {
    const { category_id } = req.params;
    const { workspace_id } = req.params;

    try {
      const categoryDelete = await CategoryService.delete(category_id, workspace_id);

      if (categoryDelete === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).send();
      }

      return res.status(HTTP_STATUS.NO_CONTENT).json();
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  editCategory = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const data = await CategoryService.edit(req.params.category_id, Category.CategoryData(req));

      return res.status(HTTP_STATUS.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Category();
