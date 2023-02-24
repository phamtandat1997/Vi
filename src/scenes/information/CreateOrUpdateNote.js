import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { GiftedForm } from '@nois/react-native-gifted-form';
import { Icon } from 'react-native-elements';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import TextAreaWidget from '../../components/giftedForm/TextAreaInput';
import Strings from '../../components/I18n/Strings';
import MyText from '../../components/myText/MyText';
import { HeaderNavStyles } from '../../constants/Styles';
import InfoFactory from '../../factories/InfoFactory';
import { Dialog } from '../../components/dialog';
import { LoadingSpinner } from '../../components/loadingSpinner';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';

const formName = 'noteForm';

class CreateOrUpdateNoteScene extends Component {

  static navigationOptions = () => {
    return {
      ...HeaderNavStyles.NavBar,
      headerTitle: I18n.t(Strings.NOTE),
    };
  };

  constructor() {
    super();
  }

  onSubmit = async (isValid, values, validationResults, postSubmit = null) => {
    Keyboard.dismiss();
    postSubmit();

    try {
      LoadingSpinner.show();
      const data = { ...this.props.note, content: values.note };
      await InfoFactory.fetchCreateOrUpdateNote({
        ...data,
        ...this.props.navigation.state.params,
      });
      LoadingSpinner.hide();
      setTimeout(
        () => Dialog.alertSuccess('Ghi chú đã được cập nhật thành công',
          'Thành công'), 300);
    } catch (e) {
      LoadingSpinner.hide();
      setTimeout(
        () => Dialog.alertError('Đã xảy ra lỗi. Không thể cập nhật ghi chú',
          'Lỗi'), 300);
      if (__DEV__) {
        console.log('[ERROR] Update Note', e);
      }
    }
  };

  renderNoteInput() {
    const { note } = this.props;

    return (
      <TextAreaWidget
        // disableFullscreenUI={true}
        selectionColor={Colors.primary}
        placeholderTextColor={Colors.textDark}
        autoCapitalize='none'
        placeholder={I18n.t(Strings.NOTE)}
        name="note"
        value={note ? note.content : ''}
        formName={formName}
        widgetStyles={{
          inputContainer: {
            fontSize: 25,
            borderWidth: 1,
            borderColor: Colors.grey,
            borderRadius: 3,
            borderBottomWidth: 1,
          },
        }}
      />
    );
  }

  renderSubmitButton() {
    const { buttonStyles } = styles;

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
        <MyText style={{ fontSize: 16, color: Colors.primaryConstraint }}>
          {I18n.t(Strings.UPDATE)}
        </MyText>
      </GiftedForm.SubmitWidget>
    );
  }

  render() {
    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.CHILD}>
        <GiftedForm
          scrollEnabled={false}
          formStyles={styles.formStyles}
          formName={formName}
        >
          {this.renderNoteInput()}
          {this.renderSubmitButton()}
        </GiftedForm>
      </BackHandlerProvider>
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
};

const mapStateToProps = state => {
  return {
    note: state.info.get('note'),
  };
};

export default connect(mapStateToProps, null)(CreateOrUpdateNoteScene);