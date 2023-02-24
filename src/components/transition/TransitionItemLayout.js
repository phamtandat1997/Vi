import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';

import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';

export default class TransitionItemLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress && this.props.onPress();
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { container, textStyle, wrapper } = styles;
    const ComponentContainer = this.props.onPress ? TouchableOpacity : View;

    return (
      <ComponentContainer
        {...this.props}
        onPress={this.onPress}
        style={[container, this.props.containerStyle]}>
        <View style={wrapper}>
          <MyText
            numberOfLines={1}
            style={[textStyle, { flexGrow: 1, flexShrink: 1 }]}>
            {this.props.col1}
          </MyText>
          <MyText style={[textStyle, { width: 140 }]}>
            {this.props.col2}
          </MyText>
          <MyText style={[textStyle, { width: 140 }]}>
            {this.props.col3}
          </MyText>
        </View>
        <View style={{ width: 120 }}>{this.props.col4}</View>
      </ComponentContainer>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: 'rgba(0,0,0,.12)',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.primaryConstraint,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStyle: {
    fontSize: 20,
  },
  layoutCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 30,
  },
  statusContainer: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
  },
};