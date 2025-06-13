const mongoose = require('mongoose');


const notificationchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    body:{
        type: String,
        required: true,
        trim:true,
    },
    type:{
        type: String,
        required: true,
        trim:true,
    },
    link:{
        type: String,
        required: true,
        trim:true,
    },
    Qanswer:{
        type: String,
        required: false,
        trim:true,
    },
   

});

const Notifi = mongoose.model("Notifi",notificationchema);
module.exports = Notifi;