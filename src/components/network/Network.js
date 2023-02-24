import React from "react";
import { NetInfo } from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import fromNetwork from '../../store/network';


const api = {};
export const NetworkStatusApi = api;

let listeners = [];

class Network extends React.Component {
  constructor(props) {
    super(props);
    this.check = this.check.bind(this);
    this.hasConnection = this.hasConnection.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);

    this.state = {
      isConnected: false,
    };
  }

  handleFirstConnectivityChange = (isConnected) => {
    console.log('network status', isConnected);
    this.setState({ isConnected: isConnected });
    this.props.setIsConnected(isConnected);
    listeners.forEach(cb => cb(isConnected));
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );

    api.check = this.check;
    api.hasConnection = this.hasConnection;
    api.addEventListener = this.addEventListener;
    api.removeEventListener = this.removeEventListener;
  }

  // componentWillUnmount() {
  //   NetInfo.isConnected.removeEventListener(
  //     'connectionChange',
  //     this.handleFirstConnectivityChange
  //   );
  // }

  addEventListener(cb) {
    listeners.push(cb);
  }

  removeEventListener(cb) {
    listeners = listeners.filter(c => c !== cb);
  }

  hasConnection(cb, cb2) {
    const { isConnected } = this.state;
    if (isConnected) {
      if (cb) {
        cb();
      }
    } else {
      if (cb2) {
        cb2();
      }
    }
  }

  check() {
    return this.state.isConnected;
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return {
    network: state.network,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setIsConnected: fromNetwork.actions.setIsConnected,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Network);