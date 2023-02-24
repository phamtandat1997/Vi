import React from 'react';
import { View } from 'react-native';

import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';

export default class InventoryItemLayout extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const { container, textStyle } = styles;

    return (
      <View style={[container, this.props.style]}>
        <MyText
          numberOfLines={1}
          style={[textStyle, { flexGrow: 1, flexShrink: 1 }]}>
          {this.props.col1}
        </MyText>
        <MyText
          numberOfLines={1}
          style={[textStyle, { width: 140 }]}>
          {this.props.col2}
        </MyText>
      </View>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: 'rgba(0,0,0,.12)',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.primaryConstraint,
  },
  textStyle: {
    fontSize: 20,
    textAlign: 'left',
  },
};