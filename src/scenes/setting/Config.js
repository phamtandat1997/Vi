import React, { Component } from 'react';
import {
  View,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  GiftedForm,
  GiftedFormManager,
} from '@nois/react-native-gifted-form';

import { CurrentMarketSelectorButton } from '../../components/navigationButton';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import Colors from '../../constants/Colors';
import { NavigationHeader } from '../../components/header/NavigationHeader';
import Strings from '../../components/I18n/Strings';
import MyText from '../../components/myText/MyText';
import { Translate } from '../../components/I18n';
import TextInputMask from '../../components/giftedForm/TextInputMask';
import MarketFactory from '../../factories/MarketFactory';
import { Dialog } from '../../components/dialog';
import fromTrading from '../../store/trading';
import fromApp from '../../store/app';
import ProductFactory from '../../factories/ProductFactory';
import { FormConfig } from '../../constants/FormConfig';
import TextInputWidget from '../../components/giftedForm/TextInputWidget';

const formName = 'configForm';

class ConfigScene extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          navigation={navigation}
          title={Strings.SETTING}
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      myForm: {
        timeSync: props.timeSync,
        batteryPercent: props.batteryPercent,
        scheduleSendBatteryInfo: props.scheduleSendBatteryInfo.join(', '),
      },
    };

    this.supermarketId = this.props.selectedMarket;
  }

  saveBatteryPercent = (batteryPercent) => {
    if (batteryPercent !== this.props.batteryPercent) {
      batteryPercent = typeof batteryPercent === 'string' ?
        parseInt(batteryPercent) : this.batteryPercent;
      this.props.setBatteryPercent(batteryPercent);
    }
  };

  saveSuperMarket = () => {
    if (this.props.selectedMarket !== this.supermarketId) {
      MarketFactory.setMarket(this.supermarketId);
    }
  };

  saveTimeSync = (timeSync) => {
    if (timeSync !== this.props.timeSync) {
      this.props.setTimeSync(this.timeSync);
      ProductFactory.clearIntervalFetchPurchases();
      ProductFactory.fetchPurchases();
    }
  };

  saveScheduleSendBatteryInfo = (scheduleSendBatteryInfo) => {
    scheduleSendBatteryInfo = scheduleSendBatteryInfo.replace(/ /g,'').split(',');
    this.props.setSchedulerBatteryInfo(scheduleSendBatteryInfo);
  };

  onSave = (isValid, values, validationResults, postSubmit = null) => {
    Keyboard.dismiss();
    postSubmit();
    if (isValid) {
      const { batteryPercent, scheduleSendBatteryInfo, timeSync } = values;
      this.saveTimeSync(timeSync);
      this.saveBatteryPercent(batteryPercent);
      this.saveSuperMarket();
      this.saveScheduleSendBatteryInfo(scheduleSendBatteryInfo);

      setTimeout(() => Dialog.alertSuccess(Translate('CONFIG_SAVE_SUCCESS')),
        300);
    } else {
      const message = GiftedFormManager.getValidationErrors(validationResults).
        join('\n');
      Dialog.alertError(message);
    }
  };

  onSelectSuperMarket = (supermarketId) => {
    this.supermarketId = supermarketId;
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

  renderSelectSuperMarket() {
    const { labelText, selectSuperMarketStyles, fieldContainer } = styles;

    return (
      <View style={fieldContainer}>
        <MyText style={labelText}>
          {Translate('SELECT_SUPER_MARKET')}
        </MyText>
        <CurrentMarketSelectorButton
          onSelect={this.onSelectSuperMarket}
          style={selectSuperMarketStyles}
        />
      </View>
    );
  }

  renderTimeSync() {
    const { labelText, textInputStyles, fieldContainer } = styles;
    const field = FormConfig.configForm.fields.timeSync;

    return (
      <View style={fieldContainer}>
        <MyText style={labelText}>
          {Translate('TIME_SYNC')}
        </MyText>
        <TextInputMask
          value={this.state.myForm[field]}
          onChangeText={value => this.handleValueChange(value, field)}
          name={field}
          keyboardType={'phone-pad'}
          selectionColor={Colors.primary}
          autoCapitalize='none'
          formName={formName}
          widgetStyles={textInputStyles}
          mask={'[999999999999]'}
        />
      </View>
    );
  }

  renderSchedulerBatteryPercent() {
    const { labelText, textInputStyles, fieldContainer } = styles;
    const field = FormConfig.configForm.fields.scheduleSendBatteryInfo;

    return (
      <View style={fieldContainer}>
        <MyText style={labelText}>
          {Translate('SCHEDULER_BATTERY_PERCENT')}
        </MyText>
        <TextInputWidget
          name={field}
          value={this.state.myForm[field]}
          onChangeText={value => this.handleValueChange(value, field)}
          selectionColor={Colors.primary}
          autoCapitalize='none'
          formName={formName}
          widgetStyles={textInputStyles}
        />
      </View>
    );
  }

  renderBatteryPercent() {
    const { labelText, textInputStyles, fieldContainer } = styles;
    const field = FormConfig.configForm.fields.batteryPercent;

    return (
      <View style={fieldContainer}>
        <MyText style={labelText}>
          {Translate('BATTERY_PERCENT_TO_SEND')}
        </MyText>
        <TextInputMask
          name={field}
          value={this.state.myForm[field]}
          onChangeText={value => this.handleValueChange(value, field)}
          keyboardType={'phone-pad'}
          selectionColor={Colors.primary}
          autoCapitalize='none'
          formName={formName}
          widgetStyles={textInputStyles}
          mask={'[99]'}
        />
      </View>
    );
  }

  renderSubmitButton() {
    return (
      <GiftedForm.SubmitWidget
        widgetStyles={styles.buttonStyles}
        title={Translate('SAVE_CONFIG')}
        onSubmit={this.onSave}
      />
    );
  }

  render() {
    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.MENU}>
        <GiftedForm
          validators={FormConfig.configForm.validators}
          formName={formName}
          scrollEnabled={true}
          formStyles={styles.container}>
          {this.renderSelectSuperMarket()}
          {this.renderTimeSync()}
          {this.renderSchedulerBatteryPercent()}
          {this.renderBatteryPercent()}
          {this.renderSubmitButton()}
        </GiftedForm>
      </BackHandlerProvider>
    );
  }
}

const styles = {
  container: {
    containerView: {
      flex: 1,
      backgroundColor: Colors.greySecondary,
      width: '100%',
    },
  },
  layoutCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    marginBottom: 5,
    fontSize: 20,
    color: Colors.blackPrimary,
  },
  fieldContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  buttonStyles: {
    submitButton: {
      backgroundColor: Colors.buttonPrimary,
      width: 100,
      borderRadius: 5,
    },
    submitButtonWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  },
  textInputStyles: {
    inputContainer: {
      paddingHorizontal: 10,
      height: 50,
      marginBottom: 0,
      borderWidth: 1,
      borderColor: Colors.grey,
      borderRadius: 3,
      borderBottomWidth: 1,
    },
    rowContainer: {
      marginBottom: 0,
      paddingHorizontal: 0,
    },
  },
  selectSuperMarketStyles: {
    container: {
      backgroundColor: Colors.primaryConstraint,
    },
    textStyle: { color: Colors.blackPrimary },

    selectWidgetStyles: {
      rowContainer: {
        flexGrow: 1,
        backgroundColor: Colors.greySecondary,
      },
      wrapper: {
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 3,
        borderBottomWidth: 1,
      },
    },
    selector: {
      placeholderColor: Colors.primaryConstraint,
      textColor: Colors.blackPrimary,
    },
  },
};

const mapStateToProps = state => {
  return {
    timeSync: state.trading.get('timeSync'),
    selectedMarket: state.app.get('selectedMarket'),
    batteryPercent: state.app.get('batteryPercent'),
    scheduleSendBatteryInfo: state.app.get('scheduleSendBatteryInfo'),
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setTimeSync: fromTrading.actions.setTimeSync,
    setBatteryPercent: fromApp.actions.setBatteryPercent,
    setSchedulerBatteryInfo: fromApp.actions.setSchedulerBatteryInfo,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigScene);
