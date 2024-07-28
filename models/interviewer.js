const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const InterviewerSchema = new Schema({
    username: String,
    password: String,
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    company: { 
        type: String,
        required: true
    },
    description: { 
        type: String 
    },
    image: {
        type: String
    },
    resume: { 
        type: String 
    }, 
    active: {
         type: Boolean, 
         default: true 
        }
}) 

module.exports = mongoose.model('Interviewer', InterviewerSchema);