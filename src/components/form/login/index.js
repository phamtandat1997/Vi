import React, { Component } from 'react';
import {
  Keyboard,
} from 'react-native';
import I18n from 'react-native-i18n';
import {
  GiftedForm,
  GiftedFormManager,
} from '@nois/react-native-gifted-form';

import TextInputWidget from '../../giftedForm/TextInputWidget';
import { Dialog } from '../../dialog';
import Colors from '../../../constants/Colors';
import { VALIDATORS } from '../../../constants/FormConfig';
import Strings from '../../I18n/Strings';

const formName = 'loginForm';

export default class LoginForm extends Component {

  constructor() {
    super();

    this.state = {
      myForm: {
        username: '',
        password: '',
      },
    };
  }

  onSubmit = (isValid, values, validationResults, postSubmit = null) => {
    Keyboard.dismiss();
    if (isValid) {
      this.props.onSubmit(values, postSubmit, () => {
        GiftedFormManager.reset('loginForm');
        this.setState({
          myForm: {
            username: '',
            password: '',
          },
        });
      });
    } else {
      const message = GiftedFormManager.getValidationErrors(validationResults).
        map(message => I18n.t(message)).join('\n');
      Dialog.alertError(message, 'Lỗi');
    }
  };

  handleValueChange = (value, field) => {
    const data = {};
    data[field] = value;

    this.setState({
      myForm: {
        ...this.state.myForm,
        ...data,
      },
    });
  };

  renderInputEmail() {
    return (
      <TextInputWidget
        selectionColor={Colors.primaryConstraint}
        placeholderColor={Colors.primaryConstraint}
        autoCapitalize='none'
        placeholder={I18n.t(Strings.USERNAME)}
        name="username"
        value={this.state.myForm.username}
        widgetStyles={styles.textInputStyles}
        formName={formName}
        onChangeText={text => this.handleValueChange(text, 'username')}
      />
    );
  }

  renderInputPassword() {
    return (
      <TextInputWidget
        selectionColor={Colors.primaryConstraint}
        placeholderColor={Colors.primaryConstraint}
        placeholder={I18n.t(Strings.PASSWORD)}
        name="password"
        secureTextEntry={true}
        value={this.state.myForm.password}
        widgetStyles={styles.textInputStyles}
        formName={formName}
        onChangeText={text => this.handleValueChange(text, 'password')}
      />
    );
  }

  renderSubmitButton() {
    return (
      <GiftedForm.SubmitWidget
        activityIndicatorColor={Colors.primaryConstraint}
        widgetStyles={styles.buttonStyles}
        title={I18n.t(Strings.LOGIN)}
        onSubmit={this.onSubmit}
      />
    );
  }

  render() {
    return (
      <GiftedForm
        scrollEnabled={false}
        formStyles={styles.formStyles}
        formName={formName}
        validators={VALIDATORS.loginForm}
      >
        {this.renderInputEmail()}
        {this.renderInputPassword()}
        {this.renderSubmitButton()}
      </GiftedForm>
    );
  }
}

const styles = {
  formStyles: {
    containerView: {
      flex: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  textInputStyles: {
    rowContainer: {
      marginBottom: 10,
    },
    inputContainer: {
      backgroundColor: 'transparent',
      borderBottomColor: Colors.primaryConstraint,
      borderBottomWidth: 1,
      marginLeft: 0,
    },
    inputStyle: {
      color: Colors.primaryConstraint,
      marginLeft: 0,
    },
  },
  buttonStyles: {
    submitButton: {
      backgroundColor: 'transparent',
      width: 100,
      borderColor: Colors.primaryConstraint,
      borderWidth: 1,
    },
  },
};

