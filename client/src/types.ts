export interface Message {
  user: string;
  text: string;
  date: Date;
}

export interface User {
  userID: string;
  username: string;
}

export interface Room extends User {
  messages: Message[];
  connected: boolean;
  hasNewMessages: boolean;
}
