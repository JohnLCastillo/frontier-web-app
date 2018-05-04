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
        default: ''
    },
    votes:{ type: Number, default: 3,  min: [0, 'Make me rich, buy more votes.'],}
});

UserSchema.path('votes').validate(function(value) {
    // When running in `validate()` or `validateSync()`, the
    // validator can access the document using `this`.
    // Does **not** work with update validators.
    console.log('models -> value: ', value);
    return value >= 0;
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