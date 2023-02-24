import React, { Component } from 'react';
import {
  Keyboard,
  TouchableOpacity,
  View,
} from 'react-native';
import I18n from 'react-native-i18n';
import { GiftedForm } from '@nois/react-native-gifted-form';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';

import Colors from '../../../constants/Colors';
import Strings from '../../I18n/Strings';
import TextAreaWidget from '../../giftedForm/TextAreaInput';
import MyText from '../../myText/MyText';
import TextInputWidget from '../../giftedForm/TextInputWidget';

const formName = 'noteForm';

export default class NoteForm extends Component {

  constructor() {
    super();

    this.state = {
      myForm: {
        note: '',
      },
      isOpen: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(isValid, values, validationResults, postSubmit = null) {
    this.toggleModal();
    Keyboard.dismiss();
    // if (isValid) {
    //   this.props.onSubmit(values, postSubmit, () => {
    //     GiftedFormManager.reset('loginForm');
    //     this.setState({
    //       username: '',
    //       password: '',
    //     });
    //   });
    // } else {
    //   const message = GiftedFormManager.getValidationErrors(validationResults).
    //     join('\n');
    //   // DropDown.showErrorAlert(message);
    //   Dialog.alertError(message);
    // }
  };

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  handleValueChange = (values) => {
    this.setState({ myForm: values });
  };

  renderHeader() {
    const { headerContainer, textHeaderStyle } = styles;

    return (
      <View style={headerContainer}>
        <MyText style={textHeaderStyle}>
          {I18n.t(Strings.CREATE_NOTE)}
        </MyText>
        <TouchableOpacity onPress={this.toggleModal}>
          <Icon color={Colors.primaryConstraint} name='close'/>
        </TouchableOpacity>
      </View>
    );
  }

  renderNoteInput() {
    const { note } = this.state.myForm;

    return (
      <TextAreaWidget
        selectionColor={Colors.primaryConstraint}
        placeholderColor={Colors.primaryConstraint}
        autoCapitalize='none'
        placeholder={I18n.t(Strings.NOTE)}
        name="note"
        value={note}
        formName={formName}
        widgetStyles={{
          inputContainer: {
            borderWidth: 1,
            borderColor: Colors.textDark,
            borderRadius: 3,
            borderBottomWidth: 1,
          },
        }}
      />
    );
  }

  renderSubmitButton() {
    const { buttonStyles, textButtonStyle } = styles;

    return (
      <GiftedForm.SubmitWidget
        widgetStyles={buttonStyles}
        activityIndicatorColor={Colors.primaryConstraint}
        onSubmit={this.onSubmit}
      >
        <Icon
          size={15}
          name='save'
          type='font-awesome'
          color={Colors.primaryConstraint}
          containerStyle={{ marginRight: 5 }}
        />
        <MyText style={textButtonStyle}>
          {I18n.t(Strings.CREATE_NOTE)}
        </MyText>
      </GiftedForm.SubmitWidget>
    );
  }

  render() {
    return (
      <Modal
        hideModalContentWhileAnimating={true}
        animationInTiming={300}
        animationOutTiming={400}
        isVisible={this.state.isOpen}
        style={{ flex: 1, margin: 0 }}
      >
        {this.renderHeader()}
        <GiftedForm
          scrollEnabled={false}
          formStyles={styles.formStyles}
          onValueChange={this.handleValueChange}
          formName={formName}
        >
          {this.renderNoteInput()}
          {this.renderSubmitButton()}
        </GiftedForm>
      </Modal>
    );
  }
}

const styles = {
  formStyles: {
    containerView: {
      flex: 1,
      backgroundColor: Colors.greySecondary,
      width: '100%',
      paddingTop: 20,
    },
  },
  buttonStyles: {
    submitButton: {
      backgroundColor: Colors.buttonSecondary,
      alignSelf: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 3,
    },
    textSubmitButton: {
      flex: 0,
    },
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: Colors.primary,
  },
  textHeaderStyle: {
    color: Colors.primaryConstraint,
    fontSize: 16,
  },
  textButtonStyle: {
    color: Colors.primaryConstraint,
    fontSize: 16,
  },
};

