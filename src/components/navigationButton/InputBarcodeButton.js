import React from 'react';
import {
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import { Translate } from '../I18n';

export class InputBarcodeButton extends React.Component {

  constructor() {
    super();

    this.state = {
      isShowInput: false,
    };

    this.text = '';
  }

  toggleVisible = () => {
    this.setState({ isShowInput: !this.state.isShowInput }, () => {
      if (this.state.isShowInput && this.textInput) {
        this.textInput.focus();
      }
    });
  };

  onChangeText = (text) => {
    this.text = text;
  };

  onSubmitEditing = () => {
    this.props.onSubmit && this.props.onSubmit(this.text);
    setTimeout(() => this.toggleVisible(), 500);
  };

  render() {
    const { container, inputStyle } = styles;

    if (!this.state.isShowInput) {
      return (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={this.toggleVisible}>
          <Icon
            size={28}
            color={Colors.primaryConstraint}
            name="keyboard"
            type={'entypo'}
          />
        </TouchableOpacity>
      );
    }
    return (
      <Animatable.View duration={300} animation="slideInDown" style={container}>
        <TextInput
          onSubmitEditing={this.onSubmitEditing}
          keyboardType={'numeric'}
          onChangeText={this.onChangeText}
          ref={ref => this.textInput = ref}
          disableFullscreenUI={true}
          style={inputStyle}
          placeholder={Translate('PLEASE_INPUT_BARCODE')}
        />
        <TouchableOpacity
          onPress={this.toggleVisible}>
          <Icon
            name={'clear'}
            size={26}
            color={Colors.textDark}
          />
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

const styles = {
  container: {
    width: Layout.window.width,
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 10,
    fontSize: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  inputStyle: {
    fontSize: 18,
  },
};
