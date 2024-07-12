export type Message = {
  id: number;
  message: string;
  id_sender: number;
  created_at: string;
  updated_at: string | null;
  name: string;
};

export type SocketMessage = {
  new: Message | undefined;
  old:
    | Message
    | {
        id: number;
        name: string;
      }
    | undefined;
  event: 'INSERT' | 'UPDATE' | 'DELETE';
};
