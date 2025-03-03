const { DataTypes } = require('sequelize');

const { db } = require('../config/db');

const Users = db.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING }
}, {
    tableName: 'users'
});

module.exports = Users;