
const mongoose = require('mongoose');

const course = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type:String,
        rerquired: true
    }
});

module.exports = course; // this to make the course schema available to other files