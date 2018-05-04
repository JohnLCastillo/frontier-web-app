import React, { Component } from "react";

class Table extends Component {
  render() {
    return (
      <div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Candidates</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody id="candidate-rows" >
            <tr>
                <td>AA</td>
                <td>{this.props.votes.AA}</td>
            </tr>
            <tr>
                <td>BB</td>
                <td>{this.props.votes.BB}</td>
            </tr>
            <tr>
                <td>CC</td>
                <td>{this.props.votes.BB}</td>
            </tr>
            </tbody>
        </table>
        <input
          type="text"
          id="voting"
          className="col-sm-8"
          placeholder="Vote for your candidate here(1 Token 1 Vote)"
        />
        <button className="btn btn-primary">
          Vote
        </button>
      </div>
    );
  }
}

export default Table;
