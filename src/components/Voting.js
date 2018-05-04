import React, { Component } from "react";

class Voting extends Component {
  render() {
    return (
      <div>
        <table className="table table-bordered">
         <thead>
          <tr>
            <th>Tokens Info</th>
            <th>Value</th>
          </tr>
         </thead>
         <tbody>
          <tr>
            <td>Tokens For Sale</td>
            <td id="tokens-total"> </td>
          </tr>
          <tr>
            <td>Tokens Sold</td>
            {/* <td id="tokens-sold">{this.props.contract.tokensSold}</td> */}
          </tr>
          <tr>
            <td>Price Per Token</td>
            {/* <td id="token-cost">{this.props.contract.tokenPrice}</td> */}
          </tr>
          <tr>
            <td>Balance in the contract</td>
            {/* <td id="contract-balance">{this.props.contract.balanceTokens}</td> */}
          </tr>
         </tbody>
        </table>
      </div>
    );
  }
}

export default Voting;
