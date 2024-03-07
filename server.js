const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static('public'));

// Array to store pixel data
let canvas = Array(100).fill().map(() => Array(100).fill('#FFFFFF'));

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send current canvas data to the client
    socket.emit('canvasData', canvas);

    // Handle pixel placement
    socket.on('placePixel', ({ x, y, color }) => {
        if (isValidPixel(x, y) && isValidColor(color)) {
            canvas[y][x] = color;
            io.emit('updateCanvas', { x, y, color });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Check if pixel coordinates are valid
function isValidPixel(x, y) {
    return x >= 0 && x < 100 && y >= 0 && y < 100;
}

// Check if color is valid (hex format)
function isValidColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:3000/${PORT}`);
});
