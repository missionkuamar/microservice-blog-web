import { Request, Response } from 'express';


export const  loginUser =  async (req: Request, res: Response) => {
    res.send("Login User");
}