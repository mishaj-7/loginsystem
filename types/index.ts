// types/index.ts
export type ActionType = 'create' | 'update' | 'delete' | 'login';

export interface LogEntry {
  _id: string;
  actionType: ActionType;
  userId: {
    _id: string;
    username: string;
  };
  userRole: string;
  metadata?: any;
  createdAt: string;
  isDeleted: boolean;
}

export interface User {
  id: string;
  username: string;
  role: string;
}
