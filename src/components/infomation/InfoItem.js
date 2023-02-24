import React from 'react';
import { View } from 'react-native';

import MyText from '../myText/MyText';
import Colors from '../../constants/Colors';
import InfoItemLayout from './InfoItemLayout';

export default class InfoItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const { product, weight } = this.props.item;

    return (
      <InfoItemLayout
        col1={<MyText>{product}</MyText>}
        col2={<MyText>{weight} kg</MyText>}
      />
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
    fontSize: 16,
  },
};