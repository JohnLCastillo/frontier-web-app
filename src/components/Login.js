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
    const { onLoggedIn } = this.props;
    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      // We don't know window.web3 version, so we use our own instance of web3
      // with provider given by window.web3
      web3 = new Web3(window.web3.currentProvider);
    }else {
      // set the provider you want from Web3.providers
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    // console.log(window.web3.eth.coinbase)
    // if (!web3.eth.getCoinbase()) {
    //   window.alert('Please activate MetaMask first.');
    //   currentCoinbase = 
    //   return;
    // }
    // console.log(window.web3.personal)
    web3.eth.getCoinbase()
    .then(data => {
      // console.log(data)
    currentCoinbase = data 
    publicAddress = currentCoinbase.toLowerCase();
    this.setState({ loading: true })

    // Look if user with current publicAddress is already present on backend
    fetch(
      `${
        process.env.REACT_APP_BACKEND_URL
      }/users?publicAddress=${publicAddress}`
    )
      .then(response => 
        // console.log('I ran',response.json())
        response.json()
      )
        .then(
          users => (users.length ? users[0] : this.handleSignup(publicAddress)))
          //   console.log('users man',users)
          //   if(users[0] === undefined){
          //     this.handleSignup(publicAddress)
          //   }else {
          //     console.log('user present')
          //   (users[0])
          //   }
          //   // users.json()
          // })
        .then(data => 
          this.handleSignMessage(data.publicAddress,data.nonce))
        .then(data => 
          this.handleAuthenticate(data.publicAddress,data.signature)
        )
      // Pass accessToken back to parent component (to save it in localStorage)
      .then(onLoggedIn)
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false });
      })
    });
      // If yes, retrieve it. If no, create it.
      // Popup MetaMask confirmation modal to sign message
      // Send signature to backend on the /auth route
  };

  handleSignMessage = (publicAddress, nonce) => {
    // console.log('this rannnnn', nonce)
    return new Promise((resolve, reject) =>
      window.web3.personal.sign(
        web3.utils.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      )
    );
  };

  handleSignup = publicAddress => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({publicAddress})
    }).then(response => {
      // console.log(publicAddress)
      response.json()
    })
    // .catch(err => console.log(err));
  }

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