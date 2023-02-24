import React, { Component } from 'react';
import {
  Keyboard,
  View,
  ScrollView,
} from 'react-native';
import I18n from 'react-native-i18n';
import {
  GiftedForm,
  GiftedFormManager,
} from '@nois/react-native-gifted-form';
import { Icon } from 'react-native-elements';
import moment from 'moment';

import ProductForm from '../../components/form/product';
import { Dialog } from '../../components/dialog';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import MyText from '../../components/myText/MyText';
import { HeaderNavStyles } from '../../constants/Styles';
import Strings from '../../components/I18n/Strings';
import MyButton from '../../components/myButton';
import CommonService from '../../utils/CommonService';
import { InputBarcodeButton } from '../../components/navigationButton/InputBarcodeButton';
import { Translate } from '../../components/I18n';
import InventoryFactory from '../../factories/InventoryFactory';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import DateTimePicker from '../../components/giftedForm/DateTimePicker';

const formName = 'inventoryForm';

export default class CreateInventoryScene extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      ...HeaderNavStyles.NavBar,
      headerTitle: `${Translate('CREATE_NEW_INVENTORY')}`,
      headerRight: <InputBarcodeButton onSubmit={navigation.state.params &&
      navigation.state.params.onSubmitSearch}/>,
    };
  };

  constructor() {
    super();

    this.state = {
      productForms: [
        {
          ref: null,
          value: null,
          guide: CommonService.createGuid(),
        },
      ],
      barcode: '',
    };

    this.productFormsRef = [...this.state.productForms];
    this.dateFilter = moment(new Date()).format('YYYY-MM-DD');
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onSubmitSearch: this.onSubmitSearch,
    });
  }

  onSubmitSearch = (barcode) => {
    this.setState({ barcode: barcode });
  };

  onSubmit = async (isValid, values, validator, postSubmit = null) => {
    Keyboard.dismiss();
    const productFormState = this.validatorProductForm(false);
    if (isValid && productFormState.isValid) {
      postSubmit();
      try {
        const applyDate = this.dateFilter;
        const products = productFormState.value.map(item => {
          let weight = item.value.weight;
          if (weight.search(',') > 0) {
            weight = weight.replace(/,/g, '.');
          }
          return {
            ...item.value,
            weight,
          };
        });

        await InventoryFactory.makeInventory(products, applyDate);
      } catch (e) {
        if (__DEV__) {
          console.log('[ERROR] onSubmit', e);
        }
      }
    } else {
      const formErrorMessage = GiftedFormManager.getValidationErrors(validator);
      const productErrorMessage = productFormState.messages;
      const message = [...formErrorMessage, ...productErrorMessage].join('\n');

      // hide loading
      postSubmit();
      // show error message
      Dialog.alertError(message, 'Lỗi');
    }
  };

  validatorProductForm(isShowError = true) {
    let cloneProductForms = [...this.state.productForms];
    let isValidForms = true;
    let index = 0;
    let errorMessage = [];

    for (const _ of cloneProductForms) {
      // get ref ProductForm Component
      const productFromRef = cloneProductForms[index].ref.getWrappedInstance();
      const { value, isValid, messages } = productFromRef.onSubmit();

      if (isValid) {
        cloneProductForms[index] = {
          ...cloneProductForms[index],
          value,
        };
      } else {
        errorMessage = messages;
        if (isShowError) {
          Dialog.alertError(messages.join('\n'), 'Lỗi');
        }
        isValidForms = false;
      }
      index++;
    }

    return {
      value: cloneProductForms,
      isValid: isValidForms,
      messages: errorMessage,
    };
  }

  addNewControl = () => {
    const { value, isValid } = this.validatorProductForm();

    if (isValid) {
      const productForms = [
        ...value, {
          ref: null,
          value: null,
          guide: CommonService.createGuid(),
        },
      ];
      this.productFormsRef = productForms;
      this.setState({ productForms });
      setTimeout(() => this.scrollView.scrollToEnd(), 500);
    }
  };

  removeProductForm = (value) => {
    const productForms = this.state.productForms.filter(
      item => item.guide !== value);

    this.productFormsRef = productForms;
    this.setState({ productForms });
  };

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
          {I18n.t(Strings.FINISH)}
        </MyText>
      </GiftedForm.SubmitWidget>
    );
  }

  renderAddNewControlButton() {
    const { addNewControlButtonStyle } = styles;

    return (
      <MyButton
        leftIcon={<Icon name={'add'} color={Colors.primaryConstraint}/>}
        containerStyle={addNewControlButtonStyle}
        title={I18n.t(Strings.ADD_PRODUCT)}
        onPress={this.addNewControl}
      />
    );
  }

  renderProductForms() {
    const { productItemContainer } = styles;
    const { productForms, barcode } = this.state;

    return productForms.map(
      (item, index) => (
        <View style={productItemContainer} key={index}>
          <ProductForm
            barcode={barcode}
            ref={ref => this.productFormsRef[index] ?
              this.productFormsRef[index].ref = ref : null}
            index={index}
            onRemove={this.removeProductForm}
            item={item.guide}
          />
        </View>
      ),
    );
  }

  render() {
    const { formStyles, buttonGroupContainer, datePickerStyles } = styles;

    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.CHILD}>
        <ScrollView
          ref={ref => this.scrollView = ref}
          style={{ flex: 1, backgroundColor: Colors.greySecondary }}
        >
          <GiftedForm
            scrollEnabled={false}
            formStyles={formStyles}
            formName={formName}
          >
            <DateTimePicker
              onSelect={date => this.dateFilter = date}
              value={this.dateFilter}
              pickerProperties={{
                maximumDate: new Date().toISOString(),
              }}
              acceptTitle={I18n.t(Strings.SELECT)}
              cancelTitle={I18n.t(Strings.CANCEL)}
              formName={formName}
              name={'applyDate'}
              widgetStyles={datePickerStyles}
            />
            {this.renderProductForms()}
            <GiftedForm.GroupWidget style={buttonGroupContainer}>
              {this.renderSubmitButton()}
              {this.renderAddNewControlButton()}
            </GiftedForm.GroupWidget>
          </GiftedForm>
        </ScrollView>
      </BackHandlerProvider>
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
  buttonGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonStyles: {
    submitButton: {
      backgroundColor: Colors.unfilledSuccess,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 3,
      height: 43.5,
    },
    textSubmitButton: {
      flex: 0,
    },
  },
  productItemContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  textTitleProduct: {
    color: Colors.blackPrimary,
    fontSize: 16,
    marginBottom: 3,
  },
  textButtonStyle: {
    color: Colors.primaryConstraint,
    fontSize: 16,
  },
  addNewControlButtonStyle: {
    backgroundColor: Colors.buttonSecondary,
    marginTop: 0,
    paddingVertical: 9.5,
    borderRadius: 3,
    marginLeft: 10,
  },
  datePickerStyles: {
    wrapper: {
      borderWidth: 1,
      borderColor: Colors.grey,
      borderRadius: 3,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginHorizontal: 12.5,
      marginBottom: 15,
      backgroundColor: Colors.primaryConstraint,
    },
    rowContainer: {
      backgroundColor: Colors.greySecondary,
    },
  },
};