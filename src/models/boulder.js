const mongoose = require('mongoose');

let boulderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        unique: true,
        trim: true
    },
    grade: {
        type: String,
        required: true,
        enum: [ 'V+', '6a', '6a+', '6b', '6b+', '6c', 
                '6c+', '7a', '7a+', '7b', '7b+', '7c', 
                '7c+', '8a', '8a+', '8b', '8b+', '8c', 
                '8c+', '9a', '9a+', '9b', '9b+']
    },
    wall: {
        type: String,
        required: true,
        enum: [ '-10', '0', '10', '20', '30', '40']
    },
    section: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4']
    },
    share: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    coordHolds: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: String,
        default: 'Clarke'
    },
    mine: {
        type: Boolean,
        default: false
    }
});

let Boulder = mongoose.model('boulders', boulderSchema);

module.exports = Boulder;