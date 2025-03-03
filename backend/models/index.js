const Messages = require('./messages');
const Users = require('./users');

Messages.belongsTo(Users, { as: 'sender', foreignKey: 'id_sender' });

module.exports = {
    Messages, 
    Users
};