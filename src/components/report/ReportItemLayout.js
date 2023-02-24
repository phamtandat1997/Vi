import React from 'react';
import { View } from 'react-native';

import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';

export default class ReportItemLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { container, textStyle } = styles;

    return (
      <View style={[container, this.props.style]}>
        <MyText numberOfLines={1} style={[textStyle, { width: 140 }]}>
          {this.props.col1}
        </MyText>
        <MyText
          numberOfLines={1}
          style={[textStyle, { flexGrow: 1, flexShrink: 1 }]}>
          {this.props.col2}
        </MyText>
        <MyText numberOfLines={1} style={[textStyle, { width: 200 }]}>
          {this.props.col3}
        </MyText>
        <MyText numberOfLines={1} style={[textStyle, { width: '18%' }]}>
          {this.props.col4}
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