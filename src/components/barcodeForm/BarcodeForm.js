import React, { Component } from 'react';
import {
  Keyboard,
  View,
} from 'react-native';
import I18n from 'react-native-i18n';
import TextInputWidget from '../giftedForm/TextInputWidget';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Strings from '../I18n/Strings';
import MyButton from '../myButton';

export default class BarcodeForm extends Component {

  constructor() {
    super();
    this.state = {
      barcode: '',
      isFocus: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    // console.log('update barcode form: ', prevProps.barcode, this.props.barcode);
    if (prevProps.barcode !== this.props.barcode) {
      this.setState({ barcode: this.props.barcode });
    }
  }

  onSubmit() {
    Keyboard.dismiss();
    this.props.onSubmit(this.state.barcode, () => {
      this.setState({
        barcode: '',
      });
    });
  };

  onFocus(e) {
    this.setState({ isFocus: true });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onEndEditing(e) {
    this.setState({ isFocus: false });
    if (this.props.onEndEditing) {
      this.props.onEndEditing(e);
    }
  };

  renderInputBarcode() {
    const { barcode, isFocus } = this.state;
    return (
      <TextInputWidget
        disableFullscreenUI={true}
        widgetStyles={{
          rowContainer: { marginBottom: 0, marginTop: 0 },
          inputContainer: { height: 43 },
          inputStyle: { fontSize: isFocus ? 32 : 20, height: 60 },
        }}
        keyboardType='numeric' // number-pad, decimal-pad, numeric, phone-pad
        autoCapitalize='none'
        placeholder={I18n.t(Strings.INPUT_BARCODE_MANUAL)}
        name="barcode"
        nameIcon="keyboard-o"
        typeIcon="font-awesome"
        onChangeText={(v) => {
          this.setState({ barcode: v });
        }}
        onFocus={this.onFocus.bind(this)}
        onEndEditing={this.onEndEditing.bind(this)}
        value={barcode}
      />
    );
  }

  renderSubmitButton() {
    return (
      <MyButton
        onPress={this.onSubmit}
        title={this.props.buttonText || I18n.t(Strings.DONE)}
        containerStyle={{
          backgroundColor: Colors.green,
          paddingVertical: 7,
        }}
      />
    );
  }

  render() {
    return (
      <View style={[
        {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
        },
        this.state.isFocus ? {
          position: 'absolute',
          top: 0,
          left: 0,
          paddingRight: 20,
          width: Layout.window.width,
          height: 150,
          zIndex: 9999,
        } : {},
      ]}>
        <View style={{ flexGrow: 1 }}>
          {this.renderInputBarcode()}
        </View>
        <View style={{ flexShrink: 1, flexGrow: 0 }}>
          {this.renderSubmitButton()}
        </View>
      </View>
    );
  }
}
