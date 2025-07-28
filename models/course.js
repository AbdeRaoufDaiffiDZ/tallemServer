
const mongoose = require('mongoose');

const course = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false
    },
    link: {
        type:String,
        rerquired: true
    }
});

module.exports = course; // this to make the course schema available to other files