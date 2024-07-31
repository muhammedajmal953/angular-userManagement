import  Express,{ Router } from "express";
import { addUser, adminLogin, getAllUsers } from "../controllers/adminController";
import { deleteUser, editUser } from "../controllers/adminController";


const adminRouter: Router = Express.Router()

adminRouter.post('/login', adminLogin)
adminRouter.get('/users', getAllUsers)
adminRouter.post('/users', addUser)
adminRouter.delete('/deleteUser/:id', deleteUser)
adminRouter.put('/updateUser/:id', editUser)
 


export default adminRouter