import type { Server as HTTPServer } from 'node:http';
import { createServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';

const httpServer: HTTPServer = createServer();
export const io: SocketIOServer = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket) => {
  console.log(socket.id, 'connected');
});

httpServer.listen(3103, () => {
  console.log('listening on *:3103');
});
