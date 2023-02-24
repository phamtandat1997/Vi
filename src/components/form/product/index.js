import React from 'react';
import { View } from 'react-native';
import {
  GiftedForm,
  GiftedFormManager,
} from '@nois/react-native-gifted-form';
import KeyboardEvent from 'react-native-key-scanner';

import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';

import Strings from '../../I18n/Strings';
import Colors from '../../../constants/Colors';
import { FormConfig } from '../../../constants/FormConfig';
import { SelectModalStyles } from '../../../constants/Styles';
import SelectModalWidget from '../../giftedForm/SelectModalWidget';
import OptionWidget from '../../giftedForm/OptionWidget';
import MyButton from '../../myButton';
import ProductFactory from '../../../factories/ProductFactory';
import SoundService from '../../../utils/SoundService';
import Audio from '../../../constants/Audio';
import { Dialog } from '../../dialog';
import MyText from '../../myText/MyText';
import TextInputWidget from '../../giftedForm/TextInputWidget';

const formName = 'productForm';

class ProductForm extends React.Component {

  constructor(props) {
    super(props);

    this.formName = `${formName}${props.item}`;
    this.fields = FormConfig[formName].fields;
    this.validators = FormConfig[formName].validators;

    this.state = {
      myForm: {
        id: null,
        weight: null,
      },
    };
  }

  componentDidMount() {
    KeyboardEvent.onBarcodeScanner(this.scanHandler);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.barcode && nextProps.barcode.trim().length > 0) {
      this.scanHandler({
        data: nextProps.barcode,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.products !== nextProps.products ||
      this.state.myForm.id !== nextState.myForm.id ||
      this.state.myForm.weight !== nextState.myForm.weight;
  }

  componentWillUnmount() {
    KeyboardEvent.removeBarcodeScanner();
  }

  scanHandler = (value) => {
    const { myForm } = this.state;

    if (value.data && myForm.id === null && myForm.weight === null) {
      try {
        const product = ProductFactory.getProductByBarcode(value.data);
        if (product) {
          const { productId, weight } = product;
          this.setState({
              myForm: {
                id: productId,
                weight,
              },
            },
            () => SoundService.play(Audio.SCAN_SUCCESS));
        } else {
          SoundService.play(Audio.SCAN_FAIL);
          Dialog.alertError('Không thể lấy thông tin sản phẩm', 'Lỗi');
        }
      } catch (e) {
        SoundService.play(Audio.SCAN_FAIL);
        Dialog.alertError('Không thể lấy thông tin sản phẩm', 'Lỗi');
      }
    }
  };

  onSubmit = () => {
    const validate = GiftedFormManager.validate(this.formName);
    const messages = GiftedFormManager.getValidationErrors(validate);
    const value = GiftedFormManager.getValues(this.formName);

    return {
      value,
      messages,
      isValid: validate.isValid,
    };
  };

  onRemove = () => {
    this.props.onRemove && this.props.onRemove(this.props.item);
  };

  renderRemoveButton() {
    if (this.props.index === 0) {
      return <View style={{ width: 40, height: 40 }}/>;
    }
    return (
      <MyButton
        onPress={this.onRemove}
        containerStyle={styles.removeButtonStyle}
        leftIcon={<Icon
          name={'clear'}
          containerStyle={{ marginLeft: -2 }}
          color={Colors.primaryConstraint}
        />}
      />
    );
  }

  renderProductType() {
    const data = Object.values(this.props.products);

    return (
      <SelectModalWidget
        value={this.state.myForm.id}
        formName={this.formName}
        name={this.fields.id}
        widgetStyles={styles.selectModalStyles}
        data={data}
        placeholder={I18n.t(Strings.PRODUCT_TYPE)}
        rightIcon={true}>
        {
          data.map(item =>
            <OptionWidget
              key={item.id}
              title={item.name}
              value={item.id}
            />,
          )
        }
      </SelectModalWidget>
    );
  }

  renderWeight() {
    const { weightInputWrapper, weightUnit, textInputStyles } = styles;

    return (
      <View style={weightInputWrapper}>
        <TextInputWidget
          keyboardType={'phone-pad'}
          value={this.state.myForm.weight}
          selectionColor={Colors.primary}
          autoCapitalize='none'
          placeholder={I18n.t(Strings.WEIGHT)}
          name={this.fields.weight}
          formName={this.formName}
          widgetStyles={textInputStyles}
        />
        <MyText style={weightUnit}>Kg</MyText>
      </View>
    );
  }

  render() {
    const { formStyles } = styles;

    return (
      <GiftedForm
        scrollEnabled={false}
        formStyles={formStyles}
        onValueChange={this.handleValueChange}
        formName={this.formName}
        validators={this.validators}
      >
        {this.renderProductType()}
        {this.renderWeight()}
        {this.renderRemoveButton()}
      </GiftedForm>
    );
  }
}

const styles = {
  formStyles: {
    containerView: {
      flex: 0,
      backgroundColor: Colors.greySecondary,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  },
  removeButtonStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blackContrast,
  },
  selectModalStyles: {
    ...SelectModalStyles,
    rowContainer: {
      width: '45%',
      marginBottom: 0,
      marginRight: '1%',
      paddingHorizontal: 0,
    },
  },
  textInputStyles: {
    inputContainer: {
      // width: '90%',
      height: 51,
      marginBottom: 0,
      borderWidth: 1,
      borderColor: Colors.grey,
      borderRadius: 3,
      borderBottomWidth: 1,
      paddingVertical: 0,
      paddingTop: 0,
    },
    rowContainer: {
      paddingHorizontal: 0,
      marginBottom: 0,
      width: '90%',
    },
  },
  weightInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginLeft: '1%',
  },
  weightUnit: {
    fontSize: 16,
    color: Colors.blackPrimary,
    marginLeft: 5,
  },
};

const mapStateToProps = state => {
  return {
    products: state.product.get('entities'),
  };
};

export default connect(mapStateToProps, null, null, { withRef: true })(
  ProductForm);
