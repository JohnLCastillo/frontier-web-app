const express = require("express");
const config = require("../config");
const { CandidateModel } = require("./models");
const router = express.Router();

/** GET /candidate/results */
router.get("/results", (req, res, next) => {
  return CandidateModel.find()
    .then(data => {
      console.log('server - all candidate info', data)
      res.json(data);
    })
    .catch(next);
});

/** POST /candidate/create */
router.post("/create", (req, res, next) => {
  const { name } = req.body;

  return CandidateModel.create({ name })
    .then(data => {
      console.log('server - create candidate', data)
      res.json(data);
    })
    .catch(next);
});

/* Updating votes are in the socket file */


module.exports = { router };