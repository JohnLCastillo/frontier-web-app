'use strict';
require('dotenv').config();

const { CandidateModel } = require('./models');
const { User : UserModel } = require('../users/index');

const socketIO = require('socket.io');

module.exports = function(server) {
    const io = socketIO(server);
    
    // when a day passes, everyone gets their votes reset
    setInterval(() => {
        UserModel.updateMany({ votes : 3})
            .then(data => {
                console.log('BOT: resetting-votes', data);
                io.emit('votes reset', { votes: 3 });
        });
    }, 1 * 60 * 1000); // every 1 minutes

    io.on('connection', (socket) => {
        console.log('server-socket -> connected', socket.id);

        // when a person votes, their votes drop & everyone needs an update on candidate votes 
        socket.on('voting', (data) => {
            const { candidate: name, publicAddress } = data;
            UserModel.findOne({ publicAddress }, ['votes'], { lean: true })
                .then((user) => {
                    if (user) {
                        if (user.votes > 0) {
                          
                            return UserModel.updateOne({ publicAddress }, { $inc : { votes: -1 } }, { runValidators : true })
                                .then((data) => {
                                    console.log('candidate name: ', name);
                                    return CandidateModel.findOneAndUpdate({ name }, { $push: { votes: { publicAddress } }} )
                                        .then(data => console.log('da fk: ', data));
                                })
                                .then((candidate) => {
                                    console.log('updated candidate', candidate);
                                    return Promise.all([CandidateModel.find(), UserModel.findOne({ publicAddress }, ['votes'], { lean: true })])
                                }).then((data) => {
                                    const [allCandidates, { votes } ] = data;
                                    console.log('allCandidates: ', allCandidates);
                                    io.emit('updated votes', { allCandidates, votes } );
                                });
                        }
                    }                    
                })
                .catch((err) => {
                    console.log('voting - err', err);
                });
        });

        // when a person connects, they need to know candidate total votes & their own votes left.
        socket.on('join', (data) => {
            const { publicAddress } = data;
            console.log('join -> ', data);

            Promise.all([CandidateModel.find(), UserModel.findOne({ publicAddress }, ['votes'], { lean: true })])
                .then(data => {
                    console.log('promise.all -> join -> data: ', data);
                    socket.emit('join data', { allCandidates: data[0], votes: data[1].votes });
                });

        });

        socket.on('disconnect', (data) => {
            console.log('server-socket -> disconnect', data);
        });

        socket.on('disconnect', (data) => {
            console.log('server-socket -> disconnect', data);
        });

    });
};