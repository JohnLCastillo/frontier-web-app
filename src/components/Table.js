import React, { Component } from "react";

class Table extends Component {
  render() {
    return (
      <div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Candidates</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody id="candidate-rows" >
            <tr>
                <td>AA</td>
                <td>{this.props.AA}</td>
            </tr>
            <tr>
                <td>BB</td>
                <td></td>
            </tr>
            <tr>
                <td>CC</td>
                <td></td>
            </tr>
            </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
