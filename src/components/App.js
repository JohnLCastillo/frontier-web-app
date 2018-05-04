import React, { Component } from "react";
import io from 'socket.io-client';
import logo from "../logo.svg";
import "./App.css";
import Info from './Info'
import Login from './Login'
import Profile from './User'
import Table from "./Table";
import Voting from './Voting';
import Purchase from './Purchase'
import jwtDecode from 'jwt-decode';
const LS_KEY = "mm-login-demo:auth";

export const socket = io(process.env.REACT_APP_BACKEND_BASE_URL);

class App extends Component {
  constructor (props){
    super (props);

    const MyContract = window.web3.eth.contract([
      {
        "constant": false,
        "inputs": [],
        "name": "buy",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "account",
            "type": "address"
          }
        ],
        "name": "transferTo",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "candidate",
            "type": "bytes32"
          },
          {
            "name": "votesInTokens",
            "type": "uint256"
          }
        ],
        "name": "voteForCandidate",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "tokens",
            "type": "uint256"
          },
          {
            "name": "pricePerToken",
            "type": "uint256"
          },
          {
            "name": "candidateNames",
            "type": "bytes32[]"
          }
        ],
        "name": "Voting",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "allCandidates",
        "outputs": [
          {
            "name": "",
            "type": "bytes32[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "balanceTokens",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "candidateList",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "candidate",
            "type": "bytes32"
          }
        ],
        "name": "indexOfCandidate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "tokenPrice",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "tokensSold",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalTokens",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "candidate",
            "type": "bytes32"
          }
        ],
        "name": "totalVotesFor",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "user",
            "type": "address"
          }
        ],
        "name": "voterDetails",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          },
          {
            "name": "",
            "type": "uint256[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "voterInfo",
        "outputs": [
          {
            "name": "voterAddress",
            "type": "address"
          },
          {
            "name": "tokensBought",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "votesReceived",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ]);

    this.state = {
      ContractInstance: MyContract.at('0x31ce01dd8f9d5619fdb434f6a364f98528ddd825'),
      candidates: [],
      votes: 0
    }

    socket.on('join data', (data) => {
      console.log('join data -> ', data);
      
      this.setState({ 
        candidates: data.allCandidates,
        votes: data.votes
       });
    });

    socket.on('votes reset', (data) => {
      console.log('votes reset -> ', data);
      this.setState({ 
        votes: data.votes
       });
    });

    socket.on('updated votes', (data) => {
      console.log('updated votes -> ', data);
      this.setState({ 
        candidates: data.allCandidates,
        votes: data.votes
       });
    });
  }
  componentWillMount() {
    // Access token is stored in localstorage
    const auth = JSON.parse(localStorage.getItem(LS_KEY));
    this.setState({auth});

    // when a person is already logged in, they get their data
    if (auth) {
      const { accessToken } = auth;
      const { payload: { publicAddress } } = jwtDecode(accessToken);
      console.log('joinnnn');
      socket.emit('join', { publicAddress });
    }
  
  };

  handleLoggedIn = auth => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    this.setState({ auth });

    const { accessToken } = auth;
    const { payload: { publicAddress } } = jwtDecode(accessToken);

    // when a person logs in, they get their data
    socket.emit('join', { publicAddress });
  };

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: undefined });
  };

  render() {
    console.log('State: ', this.state);
    const { auth } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Info/>
        </header>
        <br/>
        <div className="App-intro">
          {auth ? (
            <Profile votes={this.state.votes} auth={auth} onLoggedOut={this.handleLoggedOut} />
          ) : (
            <Login onLoggedIn={this.handleLoggedIn} />
          )}
        </div>
        <div>
          <Table auth={auth} candidates={this.state.candidates}/>
          <Voting contract={this.state.ContractInstance}/>
        </div>
        <div>
          <Purchase contract={this.state.ContractInstance}/>
        </div>
      </div>
    );
  }
}

export default App;