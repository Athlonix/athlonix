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
  console.info(socket.id, 'connected');
});

const SOCKET_PORT = Number(process.env.SOCKET_PORT || 3103);

httpServer.listen(SOCKET_PORT, () => {
  console.info('Socket server is running on port 3103');
});
