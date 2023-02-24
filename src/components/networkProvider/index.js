import React from 'react';
import {
  NetInfo,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fromNetwork from '../../store/network';
import Colors from '../../constants/Colors';

const TYPE = {
  NONE: 'none',
  UNKNOWN: 'unknown',
};

class NetworkProvider extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    requestAnimationFrame(async () => {
      const { type } = await NetInfo.getConnectionInfo();

      if (type === TYPE.NONE || type === TYPE.UNKNOWN) {
        this.props.setIsConnected(false);
      }
    });

    NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
          this.props.setIsConnected(isConnected);
        },
    );
  }

  render() {
    if (this.props.isConnected) {
      return null;
    }
    const { container, textStyle } = styles;
    return (
        <View style={container}>
          <Text style={textStyle}>
            Không có kết nối Internet
          </Text>
        </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: 3,
  },
  textStyle: {
    color: Colors.primaryConstraint,
    textAlign: 'center',
  },
};

const mapStateToProps = state => {
  return {
    isConnected: state.network.get('isConnected'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setIsConnected: fromNetwork.actions.setIsConnected,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkProvider);
