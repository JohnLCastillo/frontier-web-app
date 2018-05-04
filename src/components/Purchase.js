import React, { Component } from "react";

class Purchase extends Component {
  render() {
      //console.log(this.props.contract)
    return (
      <div>
        <h2>Purchase Tokens</h2>
        <div id="buy-msg" />
        <input
          type="text"
          id="buy"
          className="col-sm-8"
          placeholder="Number of tokens to buy"
        />
        <button href="#" className="btn btn-primary">
          Buy
        </button>
      </div>
    );
  }
}

export default Purchase;
