import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';

export class DrawerButton extends React.PureComponent {

  constructor() {
    super();
  }

  onPress = () => {
    this.props.navigation.toggleDrawer();
  };

  render() {
    return (
      <TouchableOpacity style={[{ marginLeft: 10 }, this.props.style]}
                        onPress={this.onPress}>
        <Icon size={30} color={Colors.primaryConstraint} name="sort"/>
      </TouchableOpacity>
    );
  }
}
