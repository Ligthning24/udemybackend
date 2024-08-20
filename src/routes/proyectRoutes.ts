import { Router } from "express";
import {body,param} from 'express-validator'
import {ProyectController} from '../controllers/ProyectController'
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAutorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";


const router = Router();

router.use(authenticate)

router.post('/',
body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
body('description').notEmpty().withMessage('la descripcion del proyecto es obligatorio'),
handleInputErrors,
ProyectController.createProject
)

router.get('/',  ProyectController.getAllProjects)
router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    ProyectController.getProjectById
)

/** Routes for tasks* */

router.param('projectId',projectExists)


router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no valido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('la descripcion del proyecto es obligatorio'),
    handleInputErrors,
    hasAutorization,
    ProyectController.updateProject
)
router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    hasAutorization,
    ProyectController.deleteProject
)


router.post('/:projectId/tasks',
    hasAutorization,
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)
router.get('/:projectId/tasks',
    TaskController.getProjectsTasks

)

router.param('taskId',taskExists)
router.param('taskId',taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.getTaskById
)
router.put('/:projectId/tasks/:taskId',
    hasAutorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)
router.delete('/:projectId/tasks/:taskId',
    hasAutorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TaskController.deleteTask
)
router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)


/**  Routes for teams* */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Email no valido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectByTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for notes* */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatoria'),
    handleInputErrors,
    NoteController.createNote
)
router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router