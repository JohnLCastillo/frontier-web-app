'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
	nonce: {
        type: Number,
        defaultValue: Number, default: () => Math.floor(Math.random() * 10000)
    },
	publicAddress: {
        type: String
    },
	username: {
        type: String,
        unique: true
    },
    votes:{type: Number, default: 3}
});


UserSchema.methods.serialize = function() {
	return {
        nonce: this.nonce,
        publicAddress: this.publicAddress,
		username: this.username || '',
        votes: this.votes
	};
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };