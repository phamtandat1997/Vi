import React from 'react';
import { View } from 'react-native';
import I18n from 'react-native-i18n';
import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';
import Strings from '../../components/I18n/Strings';

export const STATUS = {
  Shipping: {
    value: 0,
    name: Strings.SHIPPING,
    color: Colors.orange,
    text: 'Shipping',
  },
  Received: {
    value: 1,
    name: Strings.RECEIVED,
    color: Colors.success,
    text: 'Received',
  },
};

export default class ProcessStatus extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { container, textStyle } = styles;
    if (STATUS.hasOwnProperty(this.props.status)) {
      const { name, color } = STATUS[this.props.status];

      return (
        <View style={container}>
          <MyText style={[textStyle, {backgroundColor: color}]}>
            {I18n.t(name)}
          </MyText>
        </View>
      );
    }
    return null;
  }
}

const styles = {
  container: {
    width: 110
  },
  textStyle: {
    fontSize: 16,
    color: Colors.primaryConstraint,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: 'flex-start'
  },
};