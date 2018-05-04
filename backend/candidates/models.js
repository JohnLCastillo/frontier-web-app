'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const CandidateSchema = mongoose.Schema({
	name: {
        type: String,
        default: ''
    },
    votes: [{
        publicAddress: { type: String, default: '', required : true},
        date: { type: Date, default: Date.now()}
    }]
});


CandidateSchema.methods.serialize = function() {
	return {
        name: this.name,
        votes: this.votes,
	};
};

const CandidateModel = mongoose.model('Candidate', CandidateSchema);

module.exports = { CandidateModel };