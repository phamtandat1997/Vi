import React from 'react';
import {
  Keyboard,
  View,
} from 'react-native';

import { GiftedFormManager } from '@nois/react-native-gifted-form';
import TextInputMask from 'react-native-text-input-mask';
import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';

export default class InputMask extends React.Component {

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
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, () => {
        this.updateFormValue(nextProps.value);
      });
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.errors !== this.props.errors ||
  //       nextProps.touched !== this.props.touched ||
  //       nextState.props !== this.props.value;
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

  onChangeText(formatted, extracted) {
    this.updateFormValue(extracted);
    this.setState({ value: formatted }, () => {
      if (this.props.onChangeText) {
        this.props.onChangeText(extracted);
      }
    });
  }

  updateFormValue(value) {
    const { formName, name } = this.props;
    GiftedFormManager.updateValue(formName, name, value);
  }

  renderErrorMessage() {
    const { touched, errors } = this.props;
    const isInvalid = touched && errors !== null;
    const { textError } = styles;

    if (isInvalid) {
      return <MyText style={textError}>{errors}</MyText>;
    }
    return null;
  }

  render() {
    const { placeholder, disable, mask, readOnly } = this.props;
    const { inputContainer, container } = styles;
    const { containerStyle, inputContainerStyle, inputStyle } = this.getPropStyle();

    if (disable || readOnly) {
      return (
        <View
          style={[
            container, inputContainer, this.getStyle('rowContainer'),
            this.getStyle('inputContainer'),
            { paddingHorizontal: 20, height: 50 }]}>
          <MyText style={{ fontSize: 16, lineHeight: 35 }}>
            {placeholder}
          </MyText>
        </View>
      );
    }

    // return (
    //   <View style={[container, containerStyle]}>
    //     <View style={[inputContainer, inputContainerStyle]}>
    //       <TextInputMask
    //         {...this.props}
    //         {...this.getPropStyle()}
    //         style={[{ marginLeft: 0 }, inputStyle]}
    //         refInput={ref => this.inputRef = ref}
    //         onChangeText={(formatted, extracted) => this.onChangeText(
    //           formatted, extracted)}
    //         mask={mask}
    //       />
    //     </View>
    //     {this.renderErrorMessage()}
    //   </View>
    // );

    return (
      <View style={[inputContainer, inputContainerStyle]}>
        <TextInputMask
          {...this.props}
          {...this.getPropStyle()}
          style={[{ marginLeft: 0 }, inputStyle]}
          refInput={ref => this.inputRef = ref}
          onChangeText={(formatted, extracted) => this.onChangeText(
            formatted, extracted)}
          mask={mask}
        />
        {this.renderErrorMessage()}
      </View>
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
    paddingHorizontal: 5,
  },
  errorStyle: {
    borderColor: Colors.danger,
    borderWidth: 2,
    borderBottomWidth: 2,
  },
};
