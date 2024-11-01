const mongoose = require('mongoose');
const { Schema } = mongoose;

const today = new Date();
const formattedDate = today.getFullYear() + '-' 
    + (today.getMonth() + 1).toString().padStart(2, '0') + '-' 
    + today.getDate().toString().padStart(2, '0');
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: [true,'Please write a comment!']
    },
    rating: {
        type: Number,
        required: [true,'Please provide rating from 1-5 based on your experience!'],
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: formattedDate
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Review',reviewSchema);