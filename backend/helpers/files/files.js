const AWS = require('aws-sdk');
const dotenv = require('dotenv').config();

let s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_S3_REGION
});

const uploadFile = async (params) => {
    try {
        const response = await s3.upload(params).promise();
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getFile = async (paramsGet) => {
    try {
        const response = await s3.getObject(paramsGet).promise();
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getURL = async (paramsGet) => {
    try {
        const response = await s3.getSignedUrl('getObject', paramsGet);
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const deleteFile = async (paramsDelete) => {
    try {
        const response = await s3.deleteObject(paramsDelete).promise();
        return response;
    } catch (error) {
        return null;
    }
}


const getList = async (paramsList) => {
    try {
        const response = await s3.listObjects(paramsList).promise();
        return response;
    } catch (error) {
        return null;
    }
}

module.exports = {
    getFile, uploadFile, getURL, deleteFile, getList
}