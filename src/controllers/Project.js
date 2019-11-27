import {
  setResponseError,
  checkValidationErrors,
} from "../helpers/errorHandler";
import { getWhere } from '../helpers/sql';
import ACTION_CODES from "../helpers/actionCodes";
import STATUS_CODES from '../helpers/statusCodes';
import ProjectService from '../services/project';
import StructuredDataService from '../services/structuredData';

class Project {
  static ProjectData = (req) => ({
    workspace_id: req.params.workspace_id,
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
  });

  getProjectList = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id } = req.params;

      const where = getWhere(
        req.query,
        {
          queryList: ['type', 'contragent_id'],
          maybeMultipleQuery: ['contragent_id'],
        }
      );

      where['workspace_id'] = workspace_id;

      const data = await StructuredDataService.withPagination(req, where, ProjectService.count, ProjectService.getList);

      return res.status(STATUS_CODES.OK).json(data);
    } catch (err) {
      console.log(err)
      return setResponseError(res, err);
    }
  };

  getProjectSingle = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const { workspace_id, project_id } = req.params;

      const project = await ProjectService.getSingle(project_id, workspace_id, { json: true, });

      if (!project) {
        return res.status(STATUS_CODES.NOT_FOUND).send();
      }

      return res.status(STATUS_CODES.OK).json(project);

    } catch (err) {
      return setResponseError(res, err)
    }
  };

  createProject = async (req, res) => {
    try {
      await checkValidationErrors(req);

      const createProject = await ProjectService.create(Project.ProjectData(req));

      return res.status(STATUS_CODES.CREATED).json({
        action: ACTION_CODES.CATEGORY_CREATED,
        data: createProject,
      });
    } catch (err) {
      return setResponseError(res, err)
    }
  };

  deleteProject = async (req, res) => {
    const { workspace_id, project_id } = req.params;

    try {
      const projectDelete = await ProjectService.delete(project_id, workspace_id);

      if (projectDelete === 0) {
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

      const data = await ProjectService.edit(req.params.project_id, Project.ProjectData(req));

      return res.status(STATUS_CODES.OK).json(data)
    } catch (err) {
      return setResponseError(res, err);
    }
  };
}

export default new Project();
