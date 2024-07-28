import Express,{ Router,Request,Response } from "express";
import { loginUser, registerUser } from "../controllers/userController";

const router: Router = Express.Router()

router.get('/',(req:Request,res:Response)=>{
    res.send('hello')
})
router.post('/register', registerUser)
router.post('/login', loginUser)

export default router

