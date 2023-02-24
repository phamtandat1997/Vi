import React from 'react';
import {
  View,
  Keyboard,
} from 'react-native';
import { Input } from 'react-native-elements';
import { GiftedFormManager } from '@nois/react-native-gifted-form';

import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';

export default class TextInputWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
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
    if (this.props.value !== nextProps.value || this.state.value !==
      nextProps.value) {
      this.setState({ value: nextProps.value }, () => {
        this.updateFormValue(nextProps.value);
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.errors !== this.props.errors ||
  //       nextProps.touched !== this.props.touched ||
  //       nextState.value !== this.state.value;
  // }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  getPropStyle() {
    const { container, inputContainer, errorStyle } = styles;
    const { errors, placeholderColor, touched } = this.props;

    return {
      containerStyle: [
        container,
        this.getStyle('rowContainer'),
      ],
      inputContainerStyle: [
        inputContainer,
        this.getStyle('inputContainer'),
        (touched && errors !== null) ? errorStyle : {},
      ],
      inputStyle: [
        { color: Colors.blackPrimary, fontSize: 16 },
        this.getStyle('inputStyle'),
      ],
      placeholderTextColor: placeholderColor ?
        placeholderColor : Colors.textDark,
      selectionColor: this.props.selectionColor || Colors.primary,
      labelStyle: { marginBottom: 5 },
    };
  }

  getStyle(name) {
    return this.props.widgetStyles ? this.props.widgetStyles[name] : undefined;
  }

  onChangeText(text) {
    this.updateFormValue(text);
    this.setState({ value: text }, () => {
      if (this.props.onChangeText) {
        this.props.onChangeText(text);
      }
    });
  }

  updateFormValue(value) {
    const { formName, name } = this.props;
    GiftedFormManager.updateValue(formName, name, value);
  }

  render() {
    const { placeholder, disable, errors, readOnly } = this.props;
    const { value } = this.state;
    const { inputContainer, container } = styles;
    const propStyles = this.getPropStyle();

    if (disable) {
      return (
        <View
          style={[
            container, inputContainer, this.getStyle('rowContainer'),
            this.getStyle('inputContainer'),
            { paddingHorizontal: 10, height: 50 }]}>
          <MyText style={{ fontSize: 16, lineHeight: 50, marginLeft: 5 }}>
            {placeholder}
          </MyText>
        </View>
      );
    }

    if (readOnly) {
      return (
        <View
          style={[
            container, inputContainer, this.getStyle('rowContainer'),
            this.getStyle('inputContainer'),
            { paddingHorizontal: 10, height: 50 }]}>
          <MyText style={{ fontSize: 16, lineHeight: 50, marginLeft: 5 }}>
            {value}
          </MyText>
        </View>
      );
    }

    return (
      <Input
        ref={ref => this.inputRef = ref}
        {...this.props}
        {...propStyles}
        errorMessage={errors}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => this.onChangeText(text)}
      />
    );
  }
}

const styles = {
  container: {
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: Colors.primaryConstraint,
    borderBottomWidth: 0,
    paddingVertical: 3,
    paddingTop: 6,
  },
  errorStyle: {
    borderColor: Colors.danger,
    borderWidth: 2,
    borderBottomWidth: 2,
  },
};
