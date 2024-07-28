const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;

const InterviewSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    employees: { type: Number, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Interview', InterviewSchema);
