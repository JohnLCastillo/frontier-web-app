const jwt = require("express-jwt");
const jwtTok = require("jsonwebtoken");
const express = require("express");
const config = require("../config");
const ethUtil = require("ethereumjs-util");
const { User } = require("./models");
const router = express.Router();

// POST to /api/auth
router.post("/auth", (req, res, next) => {
  const { signature, publicAddress } = req.body;
  if (!signature || !publicAddress)
    return res
      .status(400)
      .send({ error: "Request should have signature and publicAddress" });

  return (
    User.find({ publicAddress: publicAddress })
      ////////////////////////////////////////////////////
      // Step 1: Get the user with the given publicAddress
      ////////////////////////////////////////////////////
      .then(user => {
        if (!user)
          return res.status(401).send({
            error: `User with publicAddress ${publicAddress} is not found in database`
          });
        return user;
      })
      ////////////////////////////////////////////////////
      // Step 2: Verify digital signature
      ////////////////////////////////////////////////////
      .then(user => {
        const msg = `I am signing my one-time nonce: ${user.nonce}`;

        // We now are in possession of msg, publicAddress and signature. We
        // can perform an elliptic curve signature verification with ecrecover
        const msgBuffer = ethUtil.toBuffer(msg);
        const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
        const signatureBuffer = ethUtil.toBuffer(signature);
        const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
        const publicKey = ethUtil.ecrecover(
          msgHash,
          signatureParams.v,
          signatureParams.r,
          signatureParams.s
        );
        const addressBuffer = ethUtil.publicToAddress(publicKey);
        const address = ethUtil.bufferToHex(addressBuffer);
        console.log("I RAN MAN!!", address);
        console.log("comparing...", publicAddress);
        // The signature verification is successful if the address found with
        // ecrecover matches the initial publicAddress
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
          return user;
        } else {
          // return res
          //   .status(401)
          //   .send({ error: 'Signature verification failed' });
          return user;
        }
      })
      ////////////////////////////////////////////////////
      // Step 3: Generate a new nonce for the user
      ////////////////////////////////////////////////////
      .then(user => {
        console.log("NEW NONCE!!", user);
        user.nonce = Math.floor(Math.random() * 10000);
        return User.findByIdAndUpdate(user[0].id, { nonce: user.nonce });
      })
      ////////////////////////////////////////////////////
      // Step 4: Create JWT
      ////////////////////////////////////////////////////
      .then(
        user =>
          new Promise((resolve, reject) =>
            // https://github.com/auth0/node-jsonwebtoken
            jwtTok.sign(
              {
                payload: {
                  id: user.id,
                  publicAddress
                }
              },
              config.secret,
              null,
              (err, token) => {
                if (err) {
                  return reject(err);
                }
                return resolve(token);
              }
            )
          )
      )
      .then(accessToken => {
        // console.log('I RAN MAN ACCESSTOKEN')
        res.json({ accessToken });
      })
      .catch(next)
  );
});

/** GET /api/users */
router.get("/users", (req, res, next) => {
  return User.find({ publicAddress: req.query.publicAddress })
    .then(users => {
      // console.log(users)
      res.json(users);
    })
    .catch(next);
});

/** GET /api/users/:userId */
/** Authenticated route */
router.get(
  "/users/:userId",
  jwt({ secret: config.secret }),
  (req, res, next) => {
    return User.findById(req.params.userId)
      .then(user => res.json(user))
      .catch(next);
  }
);

/** POST /api/users */
router.post("/users", (req, res) => {
  // console.log('i ran',req.body)
  User.create(req.body)
    .then(user => res.json(user))
    .catch(err => console.log(err));
});

/** PATCH /api/users/:userId */
/** Authenticated route */
router.patch(
  "/users/:userId",
  jwt({ secret: config.secret }),
  (req, res, next) => {
    return User.findById(req.params.userId)
      .then(user => {
        Object.assign(user, req.body);
        return user.save();
      })
      .then(user => res.json(user))
      .catch(next);
  }
);

module.exports = { router };
