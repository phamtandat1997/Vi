import React from 'react';

import MyText from '../myText/MyText';
import InventoryItemLayout from './InventoryItemLayout';

export default class InventoryItem extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPress && this.props.onPress();
  };

  render() {
    const { ProductName, Weight } = this.props.item;

    return (
      <InventoryItemLayout
        col1={<MyText>{ProductName}</MyText>}
        col2={<MyText>{Weight} kg</MyText>}
      />
    );
  }
}