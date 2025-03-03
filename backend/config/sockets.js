const dotenv = require('dotenv');
const { io } = require('./server');

let home_controller = require('./../controllers/home');

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('register', (user) => {
        console.log({ user, socketId: socket.id });
        socket.join('fitco');
    });
  
    socket.on('sendMessage', (message) => {
        home_controller.sendMensaje(message).then(response => {

            if(response.success){
                console.log('Si');
            }else{
                console.log('No');
            }
        });
    });
  
    socket.on('disconnect', () => {
        socket.leave('fitco');
        console.log('A user disconnected');
    });
});