import React, { Component } from "react";

class Table extends Component {
  render() {
    return (
      <div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody id="candidate-rows" />
        </table>
      </div>
    );
  }
}

export default Table;
