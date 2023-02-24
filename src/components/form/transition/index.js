import React, { Component } from 'react';
import {
  Keyboard,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import I18n from 'react-native-i18n';
import {
  GiftedForm,
  GiftedFormManager,
} from '@nois/react-native-gifted-form';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';

import { Dialog } from '../../../components/dialog';
import Colors from '../../../constants/Colors';
import Strings from '../../I18n/Strings';
import MyText from '../../myText/MyText';
import TextInputWidget from '../../giftedForm/TextInputWidget';
import { FormConfig } from '../../../constants/FormConfig';
import {
  SelectModalStyles,
  TextInputStyles,
} from '../../../constants/Styles';
import MarketSelector from '../../marketSelector';
import connect from 'react-redux/es/connect/connect';
import TextInputMask from '../../giftedForm/TextInputMask';
import SelectModalWidget from '../../giftedForm/SelectModalWidget';
import OptionWidget from '../../giftedForm/OptionWidget';
import ProductForm from '../product';
import Layout from '../../../constants/Layout';

const formName = 'transitionForm';

class TransitionForm extends Component {

  constructor() {
    super();

    this.state = {
      isOpen: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.fields = FormConfig[formName].fields;
    this.validators = FormConfig[formName].validators;

  }

  onSubmit(isValid, values, validationResults, postSubmit = null) {
    Keyboard.dismiss();
    if (isValid) {
      console.log('valie', values);
      // Alert.alert(JSON.stringify(values));
      // console.log('value', values);

      postSubmit();
      // this.props.onSubmit(values, postSubmit, () => {
      //   GiftedFormManager.reset('loginForm');
      //   this.setState({
      //     username: '',
      //     password: '',
      //   });
      // });
    } else {
      const messages = GiftedFormManager.getValidationErrors(validationResults).
        join('\n');
      Dialog.alertError(messages, 'Lỗi');

    }
  };

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  renderHeader() {
    const { headerContainer, textHeaderStyle } = styles;

    return (
      <View style={headerContainer}>
        <MyText style={textHeaderStyle}>
          {this.props.title}
        </MyText>
        <TouchableOpacity onPress={this.toggleModal}>
          <Icon color={Colors.primaryConstraint} name='close'/>
        </TouchableOpacity>
      </View>
    );
  }

  renderReceiverSuperMarket() {
    const { selectedMarket, marketList } = this.props;
    const data = marketList.filter(market => market.id !== selectedMarket);

    return (
      <MarketSelector
        data={data}
        formName={formName}
        name={this.fields.receiveMarketId}
        widgetStyles={SelectModalStyles}
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
          {I18n.t(Strings.CREATE)}
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
        style={{
          flex: 1,
          margin: 0,
          width: Layout.window.width,
          backgroundColor: 'red',
        }}
      >
        {this.renderHeader()}
        <GiftedForm
          scrollEnabled={false}
          formStyles={styles.formStyles}
          onValueChange={this.handleValueChange}
          formName={formName}
          validators={this.validators}
        >
          {this.renderReceiverSuperMarket()}
          <ProductForm/>
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
      width: Layout.window.width,
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

const mapStateToProps = state => {
  return {
    marketList: state.app.get('marketList'),
    selectedMarket: state.app.get('selectedMarket'),
  };
};

export default connect(mapStateToProps, null, null, { withRef: true })(
  TransitionForm);