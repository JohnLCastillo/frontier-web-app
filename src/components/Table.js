import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import { socket } from "./App";

class Table extends Component {
  constructor(props) {
    super();
    this.state = {
      chosenCandidate: ""
    };
  }

  handleSelectChange(e) {
    const name = e.target.value;
    this.setState({ chosenCandidate: name });
  }

  sendVote(candidate) {
    //console.log("sendVote - clicked");
    const { chosenCandidate } = this.state;
    const {
      auth: { accessToken }
    } = this.props;
    const {
      payload: { publicAddress }
    } = jwtDecode(accessToken);

    socket.emit("voting", { candidate: chosenCandidate, publicAddress });
  }

  render() {
    const candidates = this.props.candidates.map(candidate => {
      return (
        <tr key={candidate._id}>
          <td>{candidate.name}</td>
          <td>{candidate.votes.length}</td>
        </tr>
      );
    });

    const optionCandidates = this.props.candidates.map(candidate => {
      return (
        <option key={candidate._id} value={candidate.name}>
          {candidate.name}
        </option>
      );
    });

    return (
      <div>
        <h1>Candidates</h1>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Candidates</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody id="candidate-rows">{candidates}</tbody>
        </table>
        <select
          name="candidates"
          value={this.state.chosenCandidate}
          onChange={e => this.handleSelectChange(e)}
        >
          {optionCandidates}
        </select>
        <button onClick={() => this.sendVote()} className="btn btn-primary">
          Vote
        </button>
      </div>
    );
  }
}

export default Table;
