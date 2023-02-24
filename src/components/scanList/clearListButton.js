import React from 'react';
import { Icon } from 'react-native-elements';
import { Translate } from '../I18n';

import Colors from '../../constants/Colors';
import MyButton from '../myButton';

export default class ClearListButton extends React.PureComponent {

  constructor() {
    super();
  }

  onPress = () => {
    this.props.onPress && this.props.onPress();
  };

  render() {
    return (
      <MyButton
        disable={this.props.disable}
        onPress={this.onPress}
        containerStyle={{
          backgroundColor: Colors.warm,
          paddingVertical: 7,
        }}
        title={Translate('CLEAR_LIST')}
        textStyle={{ paddingLeft: 5 }}
        leftIcon={
          <Icon
            size={15}
            name='trash'
            type='font-awesome'
            color={Colors.primaryConstraint}
          />
        }
      />
    );
  };
}

