// import express from 'express';
// import { createServer } from 'http';
// import { Server, Socket } from 'socket.io';
// import cors from 'cors';
// import { randomUUID } from 'crypto';

// interface User {
//     userId: string;
//     score: number;
//     socketId: string;
//     // username is optional or can be added if needed
// }

// const app = express();
// app.use(cors());

// const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*', // allow frontend origin here
//         methods: ['GET', 'POST'],
//     }
// });

// const quizRooms: Record<string, User[]> = {};

// app.get('/createroom', (_req, res) => {
//     const roomId = randomUUID().slice(0, 6); // short 6-char room ID
//     quizRooms[roomId] = [];
//     res.json({ roomId });
// });

// io.on('connection', (socket: Socket) => {
//     console.log(`Player connected: ${socket.id}`);

//     socket.on('joinRoom', ({ room, userId }: { room: string; userId: string }) => {
//         socket.join(room);
//         if (!quizRooms[room]) quizRooms[room] = [];
//         quizRooms[room].push({ userId, score: 0, socketId: socket.id });
//         io.to(room).emit('scoreboardUpdate', quizRooms[room]);
//     });

//     socket.on('joinRoom', ({ roomId, username }: { roomId: string; username: string }) => {
//         if (!quizRooms[roomId]) {
//             socket.emit('error', 'Room does not exist');
//             return;
//         }

//         socket.join(roomId);
//         quizRooms[roomId].push({ userId: username, score: 0, socketId: socket.id });

//         io.to(roomId).emit('scoreboardUpdate', quizRooms[roomId]);
//     });

//     socket.on('playerScored', ({ room, userId, points }: { room: string; userId: string; points: number }) => {
//         const players = quizRooms[room];
//         const player = players?.find(p => p.userId === userId);
//         if (player) {
//             player.score += points;
//             io.to(room).emit('scoreboardUpdate', players);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log(`Player disconnected: ${socket.id}`);
//         // Cleanup if needed
//         for (const room in quizRooms) {
//             quizRooms[room] = quizRooms[room].filter(p => p.socketId !== socket.id);
//             io.to(room).emit('scoreboardUpdate', quizRooms[room]);
//         }
//     });

//     // socket.on('disconnect', () => {
//     //     console.log(`Player disconnected: ${socket.id}`);
//     //     // Cleanup if needed
//     //     for (const room in quizRooms) {
//     //         quizRooms[room] = quizRooms[room].filter(p => p.socketId !== socket.id);
//     //         io.to(room).emit('scoreboardUpdate', quizRooms[room]);
//     //     }
//     // });
// });

// server.listen(3000, () => {
//     console.log("Quiz Socket Server running on port 3000");
// });
