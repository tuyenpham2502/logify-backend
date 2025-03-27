import { User } from './user.type';

export type SessionData = {
  user?: User;
  destroy: () => Promise<void>;
};
