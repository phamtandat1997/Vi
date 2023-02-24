import React from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GiftedFormManager } from '@nois/react-native-gifted-form';
import { Calendar } from '@nois/react-native-calendars';
import moment from 'moment';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';

export default class CalendarPickerWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isShowPlaceholder: props.isShowPlaceholder || false,
      isOpen: false,
      value: props.value !== null ? moment(props.value).toISOString() :
        moment(new Date()).toISOString(),
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);
    this.onDayPress = this.onDayPress.bind(this);
  }

  componentDidMount() {
    this.updateFormValue(this.state.value);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value && nextProps.value !== null) {
      this.setState({ value: moment(nextProps.value).toISOString() }, () => {
        this.updateFormValue(this.state.value);
      });
    }
  }

  onDayPress({ timestamp }) {
    if (this.props.readOnly) {
      return;
    }
    const value = moment(timestamp).toISOString();

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
    const { name, formName } = this.props;
    GiftedFormManager.updateValue(formName, name, value);
  }

  toggleModal() {
    if (this.props.readOnly) {
      return;
    }
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  renderRightIcon() {
    return !!this.props.rightIcon ? this.props.rightIcon :
      <Icon name='date-range' size={25} color={'#747474'}/>;
  }

  renderModal() {
    const { isOpen, value } = this.state;
    const daySelected = moment(value).format(this.getFormat());

    return (
      <Modal
        hideModalContentWhileAnimating={true}
        animationInTiming={600}
        animationOutTiming={400}
        isVisible={isOpen}
        onBackButtonPress={this.toggleModal}
        onBackdropPress={this.toggleModal}
        onSwipe={this.toggleModal}
        swipeDirection="down"
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
      >
        <Calendar
          style={{ flex: 0 }}
          {...this.props.property}
          selected={[daySelected]}
          onDayPress={this.onDayPress}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            selectedDayTextColor: '#ffffff',
            todayTextColor: Colors.primary,
            dayTextColor: Colors.blackPrimary,
            textDisabledColor: '#d9e1e8',
            dotColor: Colors.primary,
            selectedDotColor: '#ffffff',
            arrowColor: Colors.primary,
            monthTextColor: Colors.primary,
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textMonthFontWeight: 'bold',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
      </Modal>
    );
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

  render() {
    const { value, isShowPlaceholder } = this.state;
    const { placeholder, readOnly } = this.props;
    const { wrapper, rowContainer, textStyle } = styles;
    const daySelected = moment(value).format(this.getFormat());

    return (
      <View>
        <TouchableOpacity
          activeOpacity={readOnly ? 1 : 0.5}
          onPress={this.toggleModal}
          style={[rowContainer, this.getStyle('rowContainer')]}
        >
          <View style={wrapper}>
            {(daySelected === '' || isShowPlaceholder) &&
            <MyText style={textStyle}>{placeholder}</MyText>
            }
            {daySelected !== '' && !isShowPlaceholder &&
            <MyText style={[textStyle, { color: Colors.textDark }]}>
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
    marginBottom: 30,
    backgroundColor: Colors.primaryConstraint,
    borderBottomWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 15,
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
};