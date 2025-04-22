export interface IUserFields {
  username: string;
  password: string;
  token: string;
}

export interface ITask {
  user: string;
  title: string;
  description: string;
  status: string;
}
