import { Request, Response, Router } from 'express';

const userRouter = Router();

userRouter.route('/user').get((_req: Request, res: Response) => {
    res.send('GET request to /user');
});

export default userRouter;
