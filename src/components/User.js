import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';

class Profile extends Component {
  state = {
    loading: false,
    user: null,
    username: ''
  };

  componentWillMount() {
    const { auth: { accessToken } } = this.props;
    const { payload: { id } } = jwtDecode(accessToken);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(user => this.setState({ user }))
      .catch(window.alert);
  }

  handleChange = ({ target: { value } }) => {
    this.setState({ username: value });
  };

  handleSubmit = ({ target }) => {
    const { auth: { accessToken } } = this.props;
    const { user, username } = this.state;
    this.setState({ loading: true });
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user._id}`, {
      body: JSON.stringify({ username }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH'
    })
      .then(response => response.json())
      .then(user => this.setState({ loading: false, user }))
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false });
      });
  };

  render() {
    const { auth: { accessToken }, onLoggedOut } = this.props;
    const { payload: { publicAddress } } = jwtDecode(accessToken);
    const { loading, user } = this.state;

    const username = user && user.username;

    return (
      <div className="Profile">
        <p>
          Logged in as <Blockies seed={publicAddress} />
        </p>
        <div>
          Total Votes left today: {this.props.votes}
          <br/>
          My username is {username ? <p>{username}</p> : 'not set.'} My
          publicAddress is <p>{publicAddress}</p>
        </div>
        <div>
          <label htmlFor="username">Change username: </label>
          <input name="username" onChange={this.handleChange} />
          <button disabled={loading} onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
        <p>
          <button onClick={onLoggedOut}>Logout</button>
        </p>
      </div>
    );
  }
}

export default Profile;