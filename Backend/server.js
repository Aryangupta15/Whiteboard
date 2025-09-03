import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Store room data
const rooms = new Map();

// FIX: Middleware to parse JSON with increased limits for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from Frontend build
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// Create HTTP server & attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    // Optimize socket.io performance
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e7 // FIX: 10MB for large base64 images
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // User joins a room
    socket.on("joinRoom", (data) => {
        const { roomId, userInfo } = data;
        socket.join(roomId);

        // Store user info
        socket.userId = userInfo?.userId || socket.id;
        socket.userName = userInfo?.name || `User ${socket.id.slice(0, 6)}`;
        socket.userColor = userInfo?.color || "#000000";
        socket.currentRoom = roomId;

        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                users: new Map(),
                canvasState: []
            });
        }

        const room = rooms.get(roomId);
        room.users.set(socket.id, {
            id: socket.userId,
            name: socket.userName,
            color: socket.userColor,
            socketId: socket.id
        });

        console.log(`✅ ${socket.userName} (${socket.id}) joined room ${roomId}`);

        // FIX: Send current canvas state to new user (including images)
        if (room.canvasState.length > 0) {
            socket.emit("canvasState", room.canvasState);
            console.log(`📤 Sent ${room.canvasState.length} shapes to new user (including images)`);
        }

        // Notify others in room about new user
        socket.to(roomId).emit("userJoined", {
            userId: socket.userId,
            name: socket.userName,
            color: socket.userColor
        });

        // Send room info to user
        socket.emit("roomInfo", {
            roomId,
            users: Array.from(room.users.values())
        });
    });

    // Optimized drawing events with batching
    let drawingBuffer = [];
    let broadcastTimeout = null;

    // FIX: Enhanced drawing handler for images
    socket.on("drawing", (data) => {
        if (!socket.currentRoom) return;

        const room = rooms.get(socket.currentRoom);
        if (!room) return;

        // Add drawing to room's canvas state
        const drawingData = {
            ...data,
            userId: socket.userId,
            userName: socket.userName,
            timestamp: Date.now()
        };

        // FIX: Log image operations for debugging
        if (data.tool === 'image') {
            console.log(`🖼️ Image broadcast: "${data.name}" (${data.width}x${data.height}) by ${socket.userName}`);
        }

        // Update canvas state efficiently
        if (data.tool === 'pen' || data.tool === 'laser') {
            // For pen/laser, update existing stroke or add new one
            const existingIndex = room.canvasState.findIndex(item => item.id === data.id);
            if (existingIndex >= 0) {
                room.canvasState[existingIndex] = drawingData;
            } else {
                room.canvasState.push(drawingData);
            }
        } else {
            // FIX: For other tools including images, add to state
            room.canvasState.push(drawingData);
        }

        // FIX: Immediate broadcast for better real-time performance
        socket.to(socket.currentRoom).emit("drawing", drawingData);
    });

    // Handle collaborative eraser operations
    socket.on("shapes-erased", (data) => {
        if (!socket.currentRoom) return;

        const room = rooms.get(socket.currentRoom);
        if (!room) return;

        // Update room's canvas state by removing erased shapes
        if (data.deletedIndices && data.deletedIndices.length > 0) {
            // Remove shapes from canvas state based on indices
            room.canvasState = data.updatedShapes || [];

            console.log(`🗑️ User ${socket.userName} erased ${data.deletedIndices.length} shapes in room ${socket.currentRoom}`);
        }

        // Broadcast eraser operation to all other users in the room
        socket.to(socket.currentRoom).emit("shapes-erased", {
            ...data,
            userId: socket.userId,
            userName: socket.userName,
            timestamp: Date.now()
        });
    });

    // Optimized cursor movement with throttling
    let lastCursorBroadcast = 0;
    socket.on("cursorMove", (data) => {
        if (!socket.currentRoom) return;

        const now = Date.now();
        // Throttle to max 20 updates per second
        if (now - lastCursorBroadcast < 50) return;
        lastCursorBroadcast = now;

        const cursorData = {
            ...data,
            userId: socket.userId,
            name: socket.userName,
            color: socket.userColor,
            timestamp: now
        };

        socket.to(socket.currentRoom).emit("cursorMove", cursorData);
    });

    // Optimized pen drawing with batching
    socket.on("penStroke", (data) => {
        if (!socket.currentRoom) return;

        // Immediate broadcast for pen strokes
        socket.to(socket.currentRoom).emit("penStroke", {
            ...data,
            userId: socket.userId,
            timestamp: Date.now()
        });
    });

    // Handle clear canvas
    socket.on("clearCanvas", (data) => {
        if (!socket.currentRoom) return;

        const room = rooms.get(socket.currentRoom);
        if (room) {
            room.canvasState = [];
        }

        console.log(`🧹 Canvas cleared by ${socket.userName} in room ${socket.currentRoom}`);
        socket.to(socket.currentRoom).emit("clearCanvas");
    });

    // Handle canvas state updates
    socket.on("updateCanvasState", (canvasState) => {
        if (!socket.currentRoom) return;

        const room = rooms.get(socket.currentRoom);
        if (room) {
            room.canvasState = canvasState;
            socket.to(socket.currentRoom).emit("canvasState", canvasState);
        }
    });

    // Handle shape additions (for better state management)
    socket.on("shape-added", (data) => {
        if (!socket.currentRoom) return;

        const room = rooms.get(socket.currentRoom);
        if (!room) return;

        // Add shape to room's canvas state
        if (data.shape) {
            room.canvasState.push({
                ...data.shape,
                userId: socket.userId,
                userName: socket.userName,
                timestamp: Date.now()
            });
        }

        // Broadcast to other users
        socket.to(socket.currentRoom).emit("shape-added", {
            ...data,
            userId: socket.userId,
            userName: socket.userName,
            timestamp: Date.now()
        });
    });

    // Handle user leaving room
    socket.on("leaveRoom", () => {
        if (socket.currentRoom) {
            const room = rooms.get(socket.currentRoom);
            if (room) {
                room.users.delete(socket.id);

                // Clean up empty rooms
                if (room.users.size === 0) {
                    console.log(`🗂️ Cleaning up empty room: ${socket.currentRoom}`);
                    rooms.delete(socket.currentRoom);
                }
            }

            socket.to(socket.currentRoom).emit("userLeft", {
                userId: socket.userId,
                name: socket.userName
            });

            console.log(`👋 ${socket.userName} left room ${socket.currentRoom}`);
            socket.leave(socket.currentRoom);
            socket.currentRoom = null;
        }
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);

        if (socket.currentRoom) {
            const room = rooms.get(socket.currentRoom);
            if (room) {
                room.users.delete(socket.id);

                // Clean up empty rooms
                if (room.users.size === 0) {
                    console.log(`🗂️ Cleaning up empty room after disconnect: ${socket.currentRoom}`);
                    rooms.delete(socket.currentRoom);
                }
            }

            socket.to(socket.currentRoom).emit("userLeft", {
                userId: socket.userId,
                name: socket.userName
            });
        }

        io.emit("removeCursor", socket.id);
    });

    // Debug endpoint to check room states (optional)
    socket.on("getRoomState", () => {
        if (!socket.currentRoom) return;

        const room = rooms.get(socket.currentRoom);
        socket.emit("roomState", {
            roomId: socket.currentRoom,
            users: room ? Array.from(room.users.values()) : [],
            canvasStateLength: room ? room.canvasState.length : 0
        });
    });
});

// Optional REST endpoint to get room info
app.get("/rooms", (req, res) => {
    const roomInfo = Array.from(rooms.entries()).map(([roomId, room]) => ({
        roomId,
        userCount: room.users.size,
        shapeCount: room.canvasState.length,
        users: Array.from(room.users.values()).map(user => ({
            name: user.name,
            color: user.color
        }))
    }));

    res.json({
        totalRooms: rooms.size,
        rooms: roomInfo
    });
});

// FIX: Catch-all handler for React routing (MUST be after API routes)
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

// Start server with HTTP
server.listen(PORT, () => {
    console.log(` Express + Socket.IO server is running on http://localhost:${PORT}`);
    console.log(`Room info available at: http://localhost:${PORT}/rooms`);
});
