const dotenv = require('dotenv');
const { io } = require('./server');

let home_controller = require('./../controllers/home');

io.on('connection', (socket) => {
    socket.on('register', (user) => {
        socket.join('fitco');
    });
  
    socket.on('sendMessage', (message) => {
        home_controller.sendMessage(message).then(response => {

            if(response.success){
                io.to('fitco').emit('receiveMessage', response.message);
            }
        });
    });
  
    socket.on('disconnect', () => {
        socket.leave('fitco');
    });
});