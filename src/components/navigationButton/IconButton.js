import React from 'react';
import { TouchableOpacity } from 'react-native';

export class IconButton extends React.Component {

  constructor() {
    super();
  }

  onPress = () => {
    this.props.onPress();
  };

  render() {
    const showRightButton = this.props.navigation.getParam('showRightButton');
    if (showRightButton === false) {
      return null;
    }
    return (
      <TouchableOpacity style={{ marginRight: 15 }} onPress={this.onPress}>
        {this.props.icon}
      </TouchableOpacity>
    );
  }
}

