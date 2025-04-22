import { randomUUID } from 'crypto';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { IUserFields } from '../types';

const argon2 = require('argon2');
const schema = mongoose.Schema;

interface UserMethods {
  checkPassword: (password: string) => Promise<boolean>;
  generateToken(): void;
}

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};
type UserModel = Model<IUserFields, {}, UserMethods>;

const userSchema = new schema<HydratedDocument<IUserFields>, UserModel, UserMethods>({
  username: {
    type: String,
    unique: true,
    required: [true, 'username is required'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  token: String,
});

userSchema.methods.checkPassword = async function (password: string) {
  return await argon2.verify(this.password, password);
};

userSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
});

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);
export default User;
