
const mongoose = require('mongoose');

const exame = new mongoose.Schema({
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
    },
    solutionLink: {
        type:String,
        rerquired: true
    }
});

module.exports = exame; // this to make the player schema available to other files