import React, { Component } from 'react';
import Web3 from 'web3';

let web3 = null; // Will hold the web3 instance
let currentCoinbase;
let publicAddress;

class Login extends Component {
  state = {
    loading: false // Loading button state
  };

  handleAuthenticate = ( publicAddress, signature ) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());

  handleClick = () => {
    //console.log('in handleClick!');
    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      // We don't know window.web3 version, so we use our own instance of web3
      // with provider given by window.web3
      //console.log('web3 is null');
      web3 = new Web3(window.web3.currentProvider);
      // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    } else {
      // set the provider you want from Web3.providers
      //console.log('web3 is not null');
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    // //console.log(window.web3.eth.coinbase)
    // if (!web3.eth.getCoinbase()) {
    //   window.alert('Please activate MetaMask first.');
    //   currentCoinbase = 
    //   return;
    // }
    // //console.log(window.web3.personal)
    web3.eth.getCoinbase()
      .then(data => {
        //console.log('coinbase data', data);
        if (!data) {
          throw new Error('Log into Metamask.');
        }

        currentCoinbase = data;
        publicAddress = currentCoinbase.toLowerCase();
        //console.log('publicAddress from coinbase data', publicAddress);
        this.setState({ loading: true })

        // Look if user with current publicAddress is already present on backend
        return fetch(`${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`)
      })
      .then(response => response.json())
      .then(users => {
        //console.log('server-response', users);
        return (users.length ? users[0] : this.handleSignup(publicAddress))
      })
      .then(data => {
        //console.log('handleSignUp response', data);
        return this.handleSignMessage(data.publicAddress, data.nonce);
      })
      .then(data => {
        //console.log('handleSignMessage response', data);
        return this.handleAuthenticate(data.publicAddress,data.signature);
      })
      // Pass accessToken back to parent component (to save it in localStorage)
      // .then(onLoggedIn)
      .then((data) => this.props.onLoggedIn(data))
      // .then((data) => //console.log(data))
      .catch(err => {
        //console.log('err! - from login auth', err.message);
        window.alert(err);
        this.setState({ loading: false });
      });
    // If yes, retrieve it. If no, create it.
    // Popup MetaMask confirmation modal to sign message
    // Send signature to backend on the /auth route
  };

  handleSignMessage = (publicAddress, nonce) => {
    //console.log('handleSignMessage ran', nonce, publicAddress);
    return web3.eth.sign(web3.utils.sha3("this could be anything"), publicAddress).then(signature => {
        //console.log('web3 personal sign data', signature);
        return { publicAddress, signature };
      })
      .catch(err => {
        console.log('web3.eth' , err);
      });
  };

  handleSignup = publicAddress => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({publicAddress})
    }).then(response => {
      // //console.log(publicAddress)
      return response.json()
    })
    .catch(err => console.log('handle signup err: ', err));
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <p>
          Please Login/Signup with the button below
        </p>
        <button className="Login-button Login-mm" onClick={this.handleClick}>
          {loading ? 'Loading...' : 'Login/Sign up with MetaMask'}
        </button>
      </div>
    );
  }
}

export default Login;