import { HydratedDocument } from 'mongoose';
import { IUserFields } from '../types';
import { Request, Response, NextFunction } from 'express';
import { error } from 'console';
import User from '../models/User';

export interface RequestWithUser extends Request {
  user: HydratedDocument<IUserFields>;
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
  const req = expressReq as RequestWithUser;

  const token = req.get('Authorization');

  if (!token) {
    res.status(401).send({
      error: 'Token is not provided',
    });
  }

  const user = await User.findOne({ token });
  if (!user) {
    res.status(401).send({
      error: 'Token is incorrect',
    });
    return;
  }
  req.user = user;
  next();
};

export default auth;
