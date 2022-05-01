export interface Message {
  user: string;
  text: string;
  date: Date;
}

export interface APIUser {
  userID: string;
  username: string;
  connected: boolean;
  messages: [{ from: string; to: string; content: string }];
}

export interface Room {
  userID: string;
  username: string;
  connected: boolean;
  messages: Message[];
  hasNewMessages: boolean;
}

export interface AuthUser {
  userID: string;
  username: string;
}
