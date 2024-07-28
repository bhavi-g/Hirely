const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const ComapnySchema = new Schema({
    username: String,
    email: String,
    password: String,
    companyName: { 
        type: String, 
        required: true 
    },
    logo: { 
        type: String 
    },
    description: { 
        type: String 
    }
});


module.exports = mongoose.model('Company',ComapnySchema);