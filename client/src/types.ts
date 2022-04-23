export interface Message {
  user: string;
  text: string;
  date: Date;
}

export interface User {
  userID: string;
  username: string;
  connected: boolean;
}

export interface Room extends User {
  messages: Message[];
  hasNewMessages: boolean;
}
