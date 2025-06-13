const mongoose = require('mongoose');
const exame = require('./exam');
const course = require('./course');
const moduleSchema = mongoose.Schema({
    
    name:{
        type: String,
        required: true,
        trim: true,
    },
    speciality:{
        type: String,
        required: true,
        trim:true,
    },
    year:{
        type: String,
        required: true,
        trim:true,
    }
    ,
    courses:[course],
    exames:[exame],

});

const Subject = mongoose.model("Subject",moduleSchema);
module.exports = Subject;