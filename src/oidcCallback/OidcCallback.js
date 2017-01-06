import React from 'react';
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import { push } from 'react-router-redux';

class Callback extends React.Component {
  successCallback = (user) => {
    const urlBeforeRedirection = user.state.redirectUrl || '/';
    this.props.dispatch(push(urlBeforeRedirection));
  }

  render() {
    return (
      <CallbackComponent successCallback={this.successCallback} />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(null, mapDispatchToProps)(Callback);