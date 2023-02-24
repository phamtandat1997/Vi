import React from 'react';
import {
  Keyboard,
  View,
  Platform,
} from 'react-native';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { GiftedFormManager } from '@nois/react-native-gifted-form';

import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';

export default class TextAreaWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
    };

    this.onChangeText = this.onChangeText.bind(this);
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
        () => {
          if (this.inputRef) {
            this.inputRef.blur();
          }
        });
    this.updateFormValue(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, () => {
        this.updateFormValue(nextProps.value);
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.value !== this.state.value;
  // }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  getStyle(name) {
    return this.props.widgetStyles ? this.props.widgetStyles[name] : undefined;
  }

  onChangeText = (text) => {
    this.updateFormValue(text);
    this.setState({ value: text }, () => {
      this.props.onChangeText && this.props.onChangeText(text);
    });
  };

  updateFormValue(value) {
    const { formName, name } = this.props;
    GiftedFormManager.updateValue(formName, name, value);
  }

  resetTextInput() {
    this._textInput.clear();
    this._textInput.resetHeightToMin();
  }

  renderLabel() {
    const { textLabel } = styles;
    const { label } = this.props;

    if (label) {
      return (
          <MyText style={[textLabel, this.getStyle('textLabel')]}>
            {label}
          </MyText>
      );
    }
    return null;
  }

  render() {
    const { placeholder, placeholderTextColor, disableFullscreenUI } = this.props;
    const { container } = styles;

    return (
        <View style={[container, this.getStyle('rowContainer')]}>
          <AutoGrowingTextInput
              disableFullscreenUI={disableFullscreenUI || false}
              underlineColorAndroid="transparent"
              value={this.state.value}
              onChangeText={this.onChangeText}
              style={[styles.inputContainer, this.getStyle('inputContainer')]}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              maxHeight={200}
              minHeight={45}
              enableScrollToCaret
              ref={(ref) => this._textInput = ref}
          />
        </View>
    );
  }
};
const IsIOS = Platform.OS === 'ios';
const styles = {
  textLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#86939e',
    marginBottom: 5,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  inputContainer: {
    paddingLeft: 10,
    fontSize: 16,
    flex: 1,
    backgroundColor: Colors.primaryConstraint,
    borderWidth: 0,
    borderRadius: IsIOS ? 4 : 0,
  },
};