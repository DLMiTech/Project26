import express from 'express';
import employeesController from '../../controllers/employeesController.js';
import verifyJWT from "../../middleware/verifyJWT.js";
import ROLES_LIST from "../../config/roles.js";
import verifyRoles from "../../middleware/verifyRoles.js";
const router = express.Router();


router.route('/')

    .get(verifyJWT, verifyRoles(ROLES_LIST.User, ROLES_LIST.Staff, ROLES_LIST.Admin), employeesController.getAllEmployees)

    .post(verifyJWT, verifyRoles(ROLES_LIST.Staff, ROLES_LIST.Admin), employeesController.createEmployee)

    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), employeesController.updateEmployee)

    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee)

export default router;
