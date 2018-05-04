import React, { Component } from 'react';

class Info extends Component {
    render() {
        return (
            <div>
                <h3>How to use the app</h3>
                <strong>Step 1</strong>: Install the <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">metamask plugin</a> and create an account on Rinkeby Test Network and load some Ether.<a href="https://www.rinkeby.io/#faucet" target="_blank" rel="noopener noreferrer">Click here</a> if you need test ether.
                <br/>
                <strong>Step 2</strong>: Purchase tokens below by entering the total number of tokens you like to buy.
                <br/>
                 <strong>Step 3</strong>: Vote for candidates by entering their name and no. of tokens to vote with.
                 <br/>
             </div>
        );
    }
}

export default Info;