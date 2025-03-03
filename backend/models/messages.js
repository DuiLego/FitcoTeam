const { DataTypes } = require('sequelize');

const { db } = require('../config/db');

const Messages = db.define('messages', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_sender: { type: DataTypes.INTEGER },
    text: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE }
}, {
    tableName: 'messages'
});

module.exports = Messages;