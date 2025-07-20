// 'use client';

// import { useEffect, useRef } from 'react';
// // import { io, Socket } from 'socket.io-client';

// const SOCKET_SERVER_URL = 'http://localhost:5555'; // Change as needed

// export const useSocket = () => {
//     const socketRef = useRef<Socket | null>(null);

//     useEffect(() => {
//         // Create socket connection
//         const socket = io(SOCKET_SERVER_URL);
//         socketRef.current = socket;

//         // Clean up connection on unmount
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const emit = (event: string, data?: any) => {
//         socketRef.current?.emit(event, data);
//     };

//     const on = (event: string, callback: (...args: any[]) => void) => {
//         socketRef.current?.on(event, callback);
//     };

//     const off = (event: string) => {
//         socketRef.current?.off(event);
//     };

//     return {
//         socket: socketRef.current,
//         emit,
//         on,
//         off,
//     };
// };
