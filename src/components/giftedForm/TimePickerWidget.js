/*
 ====== EXAMPLE ======

 onFormValueChange(values) {
    this.setState({form: values});
 }

<GiftedForm formName='form' clearOnClose={false} onValueChange={this.onFormValueChange.bind(this)}>
 <TimePickerWidget
    title="Time"
    placeholder="Time"
    name="inspectionTime"
    scrollEnabled={false}
    formName={'form'}
    value={this.state.form.inspectionTime} />
</GiftedForm>
 */

import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
  TimePickerAndroid,
  DatePickerIOS,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  GiftedFormManager
} from '@nois/react-native-gifted-form';
import XDate from 'xdate';

const isIOS = Platform.OS === 'ios';
const timeFormat = 'hh:mm TT';

export default class TimePickerWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      title: props.title,
      text: props.displayValue || '',
      value: null,
      tempValue: null,
      // modal
      opacity: 0,
      position: new Animated.Value(0),
      animationDuration: 150,
      isOpened: false // used to determine whenever modal content is shown
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onConfirmPress = this.onConfirmPress.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const value = this.getValue(nextProps, false);
    if (value && value !== this.state.value) {
      this.setState({ value: value, tempValue: value, text: XDate(value).toString(timeFormat) });
    }
  }

  componentWillMount() {
    // Pre-fill value if it's exists
    const value = this.getValue(this.props, true);
    if (value && value !== this.state.value) {
      this.setState({ value: value, tempValue: value, text: XDate(value).toString(timeFormat) });
    }
  }

  /**
   * On Input Press
   */
  onPress() {
    if (!isIOS) {
      // android
      TimePickerAndroid.open({
        ...(this.state.value
            ? {
              hour: this.state.value.getHours(),
              minute: this.state.value.getMinutes(),
            }
            : {}
        ),
      })
        .then(({ action, hour, minute }) => {
          if (action !== TimePickerAndroid.dismissedAction) {
            const date = new Date();

            date.setHours(hour);
            date.setMinutes(minute);
            date.setSeconds(0);

            this.onSelect(date);
          }
        })
        .catch(({ code, message }) => console.info(`Cannot open date picker ${code}`, message));
    } else {
      // ios
      this.toggleModal();
    }
  }

  /**
   * trigger onSelect callback
   * @param value
   */
  onSelect(value) {
    if (isIOS) {
      this.toggleModal();
    }

    this.updateFormValue(value);

    if (this.props.onSelect) {
      this.props.onSelect(value);
    }

    this.props.onValueChange && this.props.onValueChange();
  }

  /**
   * Time picker value change handler
   * @param date
   */
  onDateChange(date) {
    this.setState({tempValue: date});
  }

  /**
   * Confirm button press handler
   */
  onConfirmPress() {
    if (!this.state.tempValue) {
      this.setState({tempValue: new Date(), text: XDate().toString(timeFormat)});
    }

    this.onSelect(this.state.tempValue);
  }

  getStyle(name) {
    return this.props.widgetStyles ? this.props.widgetStyles[name] : {};
  }

  /**
   * Get form value
   * @returns {*}
   */
  getValue(props, isInit) {
    return props.value;
    // let value = null;
    //
    // let controlName = this.props.name.replace(/{.*}$/g, '');
    // let formState = GiftedFormManager.stores[this.props.formName];
    // if (typeof formState !== 'undefined') {
    //   if (typeof formState.values[controlName] !== 'undefined') {
    //     value = formState.values[controlName];
    //   }
    // }
    //
    // return value;
  }

  /**
   * Update value to form
   * @param vl
   */
  updateFormValue(vl) {
    GiftedFormManager.updateValue(this.props.formName, this.props.name, vl);
  }

  /**
   * Content view layout event
   * @param event
   */
  onWrapperLayout = (event) => {
    const { isOpened } = this.state;

    if (!isOpened) {
      const height = event.nativeEvent.layout.height;
      this.state.position.setValue(height);
      setTimeout(() => {
        this.setState({ opacity: 1 }, () => {
          Animated.timing(
            this.state.position,
            {
              toValue: 0,
              duration: this.state.animationDuration,
              easing: Easing.linear,
            }
          ).start(() => {
            this.setState({ isOpened: true });
          });
        });
      }, 50);
    }
  };

  /**
   * Show/Hide modal
   */
  toggleModal() {
    const { isOpen, isOpened } = this.state;
    let state = { isOpen: !isOpen };

    if (isOpened && isOpen) {
      state.isOpened = false;
    }

    this.setState(state);
  }

  renderRightIcon() {
    return !!this.props.rightIcon ? this.props.rightIcon :
      <Icon name='access-time' size={25} color={'#747474'}/>;
  }

  render() {
    const { isOpen, tempValue } = this.state;
    const date = tempValue || new Date();

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.onPress();
          }} style={[styles.rowContainer, this.getStyle('rowContainer')]}>
          <View style={[styles.row, this.getStyle('row')]}>
            {
              !!this.state.title && this.state.title.length > 0 &&
              <Text numberOfLines={1} style={[styles.title, this.getStyle('title')]}>{this.state.title}</Text>
            }

            <View style={[styles.valueContainer, this.getStyle('valueContainer')]}>
              <View style={[styles.alignRight, this.getStyle('textContainer')]}>
                <Text numberOfLines={1}
                      style={[styles.value, this.getStyle('text'),
                        { color: !this.state.text ? '#B8B8B8' : '#4E4E4E' }]}>{this.state.text || this.props.placeholder}</Text>
              </View>

              <View style={{ flex: 0.1 }}>
                {this.renderRightIcon()}
              </View>

            </View>
          </View>
        </TouchableOpacity>
        <Modal visible={isOpen} transparent={true} animationType={'fade'}>
          <TouchableWithoutFeedback
            style={styles.overlayButton}
            onPressOut={this.toggleModal}
          >
            <View style={styles.modalContainer}>
              <Animated.View onLayout={this.onWrapperLayout}
                             style={[styles.wrapper, { transform: [{ translateY: this.state.position }] }]}>
                <DatePickerIOS
                  date={date}
                  mode={'time'}
                  onDateChange={this.onDateChange}
                />
                <TouchableOpacity style={[styles.confirmButton]} onPress={this.onConfirmPress}>
                  <Text style={[styles.confirmButtonText]}>Confirm</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  overlayButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  modalContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  wrapper: { width: '100%', backgroundColor: '#ffffff' },
  rowContainer: {
    flex: 1,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 2,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    height: 43,
    marginBottom: 13
  },
  row: {
    flexDirection: 'row',
    height: 41,
    alignItems: 'center'
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    paddingLeft: 10,
    paddingBottom: 5
  },
  alignRight: {
    flex: 0.9,
    alignItems: 'flex-start',
    justifyContent: 'center'
    // width: 110,
  },
  text: {
    fontSize: 14,
    color: '#999999',
  },
  valueContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  value: {
    fontSize: 18
  },
  confirmButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  confirmButtonText: {
    color: '#ff0000',
    fontSize: 18
  }
});
