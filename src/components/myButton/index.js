import React from 'react';
import { TouchableOpacity } from 'react-native';
import debounce from 'lodash/debounce';
import Color from 'color';

import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';

export default class MyButton extends React.PureComponent {

  constructor(props) {
    super(props);

    this.onPressDelay = debounce(this.onPress, 100);
  }

  onPress = () => {
    if (this.props.onPress && !this.props.disable) {
      this.props.onPress();
    }
  };

  renderLeftIcon() {
    if (this.props.leftIcon) {
      return this.props.leftIcon;
    }
    return null;
  }

  renderRightIcon() {
    if (this.props.rightIcon) {
      return this.props.rightIcon;
    }
    return null;
  }

  render() {
    const { actionContainer, actionText } = styles;
    const { containerStyle, textStyle, disable } = this.props;
    const disabled = disable === undefined ? false : disable;
    const bgColor = containerStyle && containerStyle.backgroundColor ||
      actionContainer.backgroundColor || 'grey';
    const disabledStyle = {
      backgroundColor: Color(bgColor).
        lighten(0.5).
        hex(),
    };

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={this.onPressDelay}
        style={[
          actionContainer,
          containerStyle,
          disabled ? disabledStyle : {},
        ]}
      >
        {this.renderLeftIcon()}
        {this.props.title && <MyText style={[actionText, textStyle]}>
          {this.props.title}
        </MyText>}
        {this.renderRightIcon()}
      </TouchableOpacity>
    );
  }
}

const styles = {
  actionContainer: {
    borderRadius: 2,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  actionText: {
    fontSize: 15,
    color: Colors.primaryConstraint,
  },
};
