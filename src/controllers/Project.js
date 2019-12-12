import { Op } from 'sequelize';
import db from '../config/db';
import {
  setResponseError,
  checkValidationErrors,
} from "../helpers/errorHandler";
import { removeEmpty } from '../helpers';
import { getWhere } from '../helpers/sql';
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import ProjectService from '../services/project';
import StructuredDataService from '../services/structuredData';

const PROJECT_STATUS = {
  ALL: 0,
  ACTIVE: 1,
  ARCHIVE: 2,
};

class Project {
  static ProjectData = (req) => removeEmpty({
    title: req.body.title,
    description: req.body.description,
    contragent_id: req.body.contragent_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    finished_at: req.body.finished_at,
    archived_at: req.body.archived_at,
  });

  getProjectList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;

      const { status, start_date, end_date } = req.query;

      const where = getWhere(
        req.query,
        {
          queryList: ['contragent_id'],
          maybeMultipleQuery: ['contragent_id'],
          search: [{ key: 'title', queryKey: 'search' }],
        }
      );

      const startDate = start_date * 1000;
      const endDate = end_date * 1000;

      if (status) {
        switch (parseInt(status)) {
          case PROJECT_STATUS.ALL:
            break;
          case PROJECT_STATUS.ACTIVE:
            where[Op.and] = [
              { finished_at: { [Op.eq]: null } },
              { archived_at: { [Op.eq]: null } },
            ];
            break;
          case PROJECT_STATUS.ARCHIVE:
            where['archived_at'] = {
              [Op.ne]: null
            };
            break;
          default:
            break;
        }
      }

      if (start_date && end_date) {
        where[Op.and] = [
          {
            start_date: {
              [Op.between]: [startDate, endDate]
            },
            end_date: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      } else if (start_date && !end_date) {
        where['start_date'] = {
          [Op.or]: {
            [Op.gte]: startDate,
            [Op.eq]: null
          }
        }
      } else if (!start_date && end_date) {
        where['end_date'] = {
          [Op.or]: {
            [Op.lte]: endDate,
            [Op.eq]: null
          }
        }
      }

      where['workspace_id'] = workspace_id;

      const data = await StructuredDataService.withoutPagination(req, where, ProjectService.getList);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  getProjectSingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const data = await ProjectService.getSingle(req.params.project_id, req.params.workspace_id, { json: true, });

      if (!data) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      return res.status(STATUS_CODES.OK).json(data);

    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createProject = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;
      const createData = await ProjectService.create(workspace_id, Project.ProjectData(req));

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.CATEGORY_CREATED,
        data: createData,
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  deleteProject = async (req, res) => {
    try {
      const { workspace_id, project_id } = req.params;

      const deleteData = await ProjectService.delete(project_id, workspace_id);

      if (deleteData === 0) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      return res.status(STATUS_CODES.NO_CONTENT).json();
    } catch (err) {
      return setResponseError(res, err);
    }
  };

  editProject = async (req, res) => {
    try {
      await checkValidationErrors(req);
      const { workspace_id, project_id } = req.params;

      const data = await ProjectService.edit(project_id, workspace_id, Project.ProjectData(req));

      return res.status(STATUS_CODES.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Project();
