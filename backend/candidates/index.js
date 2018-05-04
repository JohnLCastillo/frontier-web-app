'use strict';
const { CandidateModel } = require('./models');
const { router } = require('./router');
const socket  = require('./socket');

module.exports = { CandidateModel , router, socket };