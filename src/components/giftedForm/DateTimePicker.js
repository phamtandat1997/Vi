import React from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GiftedFormManager } from '@nois/react-native-gifted-form';
import moment from 'moment';
import debounce from 'lodash/debounce';

import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';
import MyButton from '../myButton';
import Layout from '../../constants/Layout';

export default class DateTimePicker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isShowPlaceholder: props.isShowPlaceholder || false,
      isOpen: false,
      value: props.value !== null ? moment(props.value).format('YYYY-MM-DD') :
        moment(new Date()).format('YYYY-MM-DD')
    };

    this.currentDate = this.state.value;
    this.toggleModal = this.toggleModal.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);
    this.onChangeDateDelay = debounce(this.onChangeDate, 300);
    this.onDayPress = this.onDayPress.bind(this);
    this.isSelectDate = false; // whether user select date
  }

  componentDidMount() {
    this.updateFormValue(this.state.value);
  }

  componentWillReceiveProps(nextProps) {
    const nextValue = nextProps.value;

    if (nextValue && moment(nextValue).isValid() &&
      !moment(nextValue).isSame(this.state.value)) {
      this.setState({ value: moment(nextValue).format('YYYY-MM-DD')}, () => {
        this.updateFormValue(this.state.value)
      });
    }
  }

  onDayPress({ timestamp }) {
    if (this.props.readOnly) {
      return;
    }
    const value = moment(timestamp).format('YYYY-MM-DD');

    this.toggleModal();
    this.setState({
      value,
      isShowPlaceholder: false,
    }, () => {
      this.updateFormValue(value);
      if (this.props.onSelect) {
        this.props.onSelect(value);
      }
    });
  }

  getFormat() {
    if (this.props.format) {
      return this.props.format;
    }
    return 'DD/MM/YYYY';
  }

  getStyle(name) {
    return this.props.widgetStyles ? this.props.widgetStyles[name] : {};
  }

  updateFormValue(value) {
    if (this.props.formName && this.props.name) {
      const { name, formName } = this.props;
      GiftedFormManager.updateValue(formName, name, value);
    }
  }

  onChangeDate = (value) => {
    this.currentDate = moment(value).format('YYYY-MM-DD');
  };

  onModalHide = () => {
    if (this.isSelectDate && this.props.onSelect) {
      this.isSelectDate = false;
      this.props.onSelect(this.state.value);
    }
  };

  selectDate = () => {
    if (this.props.readOnly) {
      return;
    }
    const value = this.currentDate;
    // mark user selected date
    this.isSelectDate = true;
    this.toggleModal();
    this.setState({
      value,
      isShowPlaceholder: false,
    });
  };

  toggleModal() {
    if (this.props.readOnly) {
      return;
    }
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  hideModal = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  renderRightIcon() {
    return !!this.props.rightIcon ? this.props.rightIcon :
      <Icon name='date-range' size={25} color={'#747474'}/>;
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

  renderDatePicker() {
    return (
      <View style={styles.datePickerContainer}>
        <DatePicker
          {...this.props.pickerProperties}
          style={{ backgroundColor: Colors.primaryConstraint }}
          date={this.state.value}
          onDateChange={this.onChangeDateDelay}
          mode={'date'}
          locale={'vi_VN'}
        />
      </View>
    );
  }

  renderGroupButtons() {
    const { groupContainer, submitButtonStyle, cancelButtonStyle } = styles;

    return (
      <View style={groupContainer}>
        <MyButton
          onPress={this.selectDate}
          containerStyle={submitButtonStyle}
          title={this.props.acceptTitle ? this.props.acceptTitle : 'OK'}
          textStyle={{ textAlign: 'center' }}
        />
        <MyButton
          containerStyle={cancelButtonStyle}
          title={this.props.cancelTitle ?
            this.props.cancelTitle : 'Cancel'}
          textStyle={{ color: Colors.primary, textAlign: 'center' }}
          onPress={this.hideModal}
        />
      </View>
    );
  }

  renderModal() {
    const { modalContainer, modalWrapper } = styles;

    return (
      <Modal
        deviceWidth={Layout.window.width + 48}
        hideModalContentWhileAnimating={true}
        isVisible={this.state.isOpen}
        onBackButtonPress={this.toggleModal}
        onBackdropPress={this.toggleModal}
        onSwipe={this.toggleModal}
        swipeDirection="down"
        style={modalContainer}
        onModalHide={this.onModalHide}
      >
        <View style={modalWrapper}>
          {this.renderGroupButtons()}
          {this.renderDatePicker()}
        </View>
      </Modal>
    );
  }

  render() {
    const { value, isShowPlaceholder } = this.state;
    const { placeholder, readOnly } = this.props;
    const { wrapper, rowContainer, textStyle } = styles;
    const daySelected = moment(value).format(this.getFormat());

    return (
      <View style={ this.getStyle('containerStyle')}>
        <TouchableOpacity
          activeOpacity={readOnly ? 1 : 0.5}
          onPress={this.toggleModal}
          style={[rowContainer, this.getStyle('rowContainer')]}
        >
          <View style={[wrapper, this.getStyle('wrapper')]}>
            {(daySelected === '' || isShowPlaceholder) &&
            <MyText style={textStyle}>{placeholder}</MyText>
            }
            {daySelected !== '' && !isShowPlaceholder &&
            <MyText style={[textStyle, { color: Colors.blackPrimary }]}>
              {daySelected}
            </MyText>}
            {this.renderRightIcon()}
          </View>
        </TouchableOpacity>
        {this.renderModal()}
        {this.renderErrorMessage()}
      </View>
    );
  }
};

const styles = {
  rowContainer: {
    backgroundColor: Colors.primaryConstraint,
    borderBottomWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  textStyle: {
    fontWeight: 'normal',
    fontSize: 17,
    color: '#9B9B9B',
    marginRight: 10,
  },
  wrapperError: {
    borderColor: Colors.danger,
    borderWidth: 2,
    borderBottomWidth: 2,
    borderBottomColor: Colors.danger,
  },
  textError: {
    margin: 5,
    fontSize: 12,
    color: Colors.danger,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalWrapper: {
    backgroundColor: Colors.primaryConstraint,
  },
  submitButtonStyle: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  cancelButtonStyle: {
    width: 120,
    backgroundColor: 'transparent',
    borderColor: Colors.primary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  datePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
};