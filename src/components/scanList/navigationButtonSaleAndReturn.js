import React from 'react';
import { Icon } from 'react-native-elements';

import Colors from '../../constants/Colors';
import MyButton from '../myButton';

export default class NavigationButtonSaleAndReturn extends React.PureComponent {

  constructor() {
    super();
  }

  onPress = () => {
    this.props.onPress && this.props.onPress();
  };

  render() {
    return (
      <MyButton
        onPress={this.onPress}
        title={this.props.title}
        textStyle={{ paddingLeft: 5 }}
        containerStyle={{
          backgroundColor: Colors.buttonSecondary,
          marginRight: 10,
          paddingVertical: 7,
        }}
        leftIcon={
          <Icon
            size={15}
            name={'reply'}
            type='font-awesome'
            color={Colors.primaryConstraint}
          />
        }
      />
    );
  };
}

