import jwt, { JwtPayload } from "Jsonwebtoken"
import { IUser } from "../model/User.js";


 export interface AuthenticatedRequest extends Request{
    user? : IUser | null
 }

export const isAuth = async(req: ReAuthenticatedRequestquest, res: Response, next: NextFunction)
:Promise<void>=>{
    try{
const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
        message: "Please Login - No auth heaer",
    });
    return;
}
const token = authHeader.split(" ")[1]
const decodeValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
if(!decodeValue || !decodeValue.user){
    res.status(401).json({
        mesage: "Invalid token"
    });
    return;
}
req.user = decodeValue.user
next();
    } catch(error){
        console.log("JWt verifyication  Error", error);
        res.status(401).json({
            message: "Please Login - JWT error",
        })
    }
}