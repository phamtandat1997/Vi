import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import MyText from '../myText/MyText';
import { Translate } from '../I18n';

const COLORS = {
  warning: '#ff3728',
  info: '#2293b0',
  danger: '#b01c20',
  success: '#45b031',
  border: '#DAD9DC',
  primary: '#3370C4',
};

const ICONS = {
  warning: 'warning',
  info: 'error',
  danger: 'close',
  success: 'done',
};

const circleRadius = 25;

export default class DialogComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modals: [],
    };
    this.show = this.show.bind(this);
    this.alert = this.alert.bind(this);
    this.alertError = this.alertError.bind(this);
    this.alertSuccess = this.alertSuccess.bind(this);
    this.alertWarning = this.alertWarning.bind(this);
    this.alertInfo = this.alertInfo.bind(this);
    this.confirm = this.confirm.bind(this);
    this.confirmCustomActions = this.confirmCustomActions.bind(this);
    this.dismiss = this.dismiss.bind(this);
  }

  _createModal(props, idx) {
    const onClose = () => {
      let { modals } = this.state;
      modals = modals.filter(m => m.id !== props.id);

      this.setState({
        modals,
      }, () => {
        if (props.onClose) {
          props.onClose();
        }
      });
    };

    const setCloseAction = () => {
      let { modals } = this.state;
      if (modals[idx]) {
        modals[idx].close = () => {
          this.refs['modal' + idx].animateClose();
        };

        this.setState({
          modals,
        });
      }
    };

    const onOpen = () => {
      setCloseAction();
      if (props.onOpen) {
        props.onOpen();
      }
    };

    const onBackDropPress = () => {
      if (!props.dismissOnTouchOutside) {
        return;
      }
      this.dismiss();
    };

    const modalHeight = props.height + (!props.hideBubble ? circleRadius : 0);
    return (<Modal
      key={idx}
      isVisible={props.visible}
      onBackdropPress={onBackDropPress}
      style={[styles.contentContainer]}
      onModalHide={onClose}
      onModalShow={onOpen}
    >
      <View style={styles.container}>
        {!props.hideBubble && <View style={styles.bubbleContainer}>
          <View style={[styles.bubble, { backgroundColor: props.bubbleColor }]}>
            <Icon name={props.bubbleIcon} size={32} color={'#ffffff'}
                  onPress={() => {
                    this.dismiss();
                  }}/>
          </View>
        </View>}

        <View style={[
          styles.innerContentContainer,
          { marginTop: !props.hideBubble ? -circleRadius : 0 }]}>
          <View style={[
            styles.title,
            { paddingTop: props.hideBubble ? 15 : 10 + circleRadius },
            props.titleStyle]}>
            <Text style={[styles.titleText, props.titleTextStyle]}>
              {props.title}
            </Text>
          </View>

          <View style={[styles.body, props.bodyStyle]}>
            {props.body}
          </View>

          {props.buttons && props.buttons.length > 0 &&
          <View style={styles.footer}>
            {props.buttons}
          </View>}
        </View>
      </View>
    </Modal>);
  }

  _createButton(text, onPress, idx, buttonStyle, textStyle) {
    return <View style={[styles.button, buttonStyle]} key={idx}>
      <TouchableOpacity
        onPress={onPress}
      >
        <View style={[styles.buttonTextContainer]}>
          <Text style={[styles.buttonText, textStyle]}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </View>;
  }

  _addModal(options) {
    if (options.overlap) {

    } else {
      this.dismiss(() => {
        this.setState({
          modals: [
            {
              id: new Date().getTime(),
              visible: true,
              dismissOnTouchOutside: true,
              height: 100,
              bodyStyle: {
                paddingHorizontal: 20,
                paddingVertical: 15,
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                ...options.bodyStyle,
              },
              ...options,
            },
          ],
        });
      });
    }
  }

  show(options, cb = null) {
    this._addModal(options);
  }

  dismiss(cb) {
    let { modals } = this.state;
    const currentModalIndex = this.state.modals.length - 1;
    if (modals[currentModalIndex]) {
      modals[currentModalIndex] = Object.assign(modals[currentModalIndex],
        { visible: false });
    }
    this.setState({
      modals,
    }, () => {
      if (cb) {
        setTimeout(() => {
          cb();
        }, 500);
      }
    });
  }

  alert(content, title = '', onCloseCb = null, overlap = false, options = {}) {
    this._addModal({
      body: content,
      title: title,
      hideBubble: true,
      onClose: onCloseCb,
      overlap,
      ...options,
    });
  }

  alertError(
    message, title = Translate('ERROR'), onCloseCb = null, overlap = false,
    options = {}) {
    this._addModal({
      body: <Text style={styles.bodyTextStyle}>{message}</Text>,
      title: title,
      hideBubble: false,
      titleTextStyle: { color: COLORS.danger },
      onClose: onCloseCb,
      overlap,
      bubbleIcon: ICONS.danger,
      bubbleColor: COLORS.danger,
      ...options,
    });
  }

  alertSuccess(
    message, title = Translate('SUCCESS'), onCloseCb = null, overlap = false,
    options = {}) {
    this._addModal({
      body: <Text>{message}</Text>,
      title: title,
      hideBubble: false,
      titleTextStyle: { color: COLORS.success },
      onClose: onCloseCb,
      overlap,
      bubbleIcon: ICONS.success,
      bubbleColor: COLORS.success,
      ...options,
    });
  }

  alertWarning(
    message, title = Translate('WARNING'), onCloseCb = null, overlap = false,
    options = {}) {
    this._addModal({
      body: <Text>{message}</Text>,
      title: title,
      hideBubble: false,
      titleTextStyle: { color: COLORS.warning },
      onClose: onCloseCb,
      overlap,
      bubbleIcon: ICONS.warning,
      bubbleColor: COLORS.warning,
      ...options,
    });
  }

  alertInfo(
    message, title = Translate('INFO'), onCloseCb = null, overlap = false,
    options = {}) {
    this._addModal({
      body: <Text>{message}</Text>,
      title: title,
      hideBubble: false,
      titleTextStyle: { color: COLORS.info },
      onClose: onCloseCb,
      overlap,
      bubbleIcon: ICONS.info,
      bubbleColor: COLORS.info,
      ...options,
    });
  }

  confirm(
    message, cb, title = Translate('CONFIRMATION'), overlap = false,
    options = {}) {
    this._addModal({
      body: <Text style={{ color: '#3c3c3c' }}>{message}</Text>,
      title: title,
      hideBubble: true,
      dismissOnTouchOutside: false,
      buttons: [
        this._createButton(Translate('YES'), () => {
          this.dismiss(() => {
            setTimeout(() => {
              cb(true);
            }, 300);
          });
        }, 0, null, { color: '#0076FF' }),
        this._createButton(Translate('NO'), () => {
            this.dismiss(() => {
              setTimeout(() => {
                cb(false);
              }, 300);
            });
          }, 1, { borderLeftWidth: 1, borderLeftColor: COLORS.border },
          { color: '#ff3728' }),
      ],
      overlap,
      ...options,
    });
  }

  confirmCustomActions(
    message, actions, title = Translate('CONFIRMATION'), overlap = false,
    options = {}) {
    let buttons = actions(this.dismiss);
    let newButtons = buttons.map((bt, idx) => {
      let btnStyle = {};
      let txtStyle = {};
      if (idx !== 0) {
        btnStyle = {
          ...btnStyle,
          borderLeftWidth: 1,
          borderLeftColor: COLORS.border,
        };
      }

      btnStyle = { ...btnStyle, ...bt.props.style };
      txtStyle = { ...txtStyle, ...bt.props.textStyle };

      return this._createButton(bt.props.title, bt.props.onPress, idx, btnStyle,
        txtStyle);
    });
    this._addModal({
      body: <MyText>{message}</MyText>,
      title: title,
      hideBubble: true,
      dismissOnTouchOutside: false,
      buttons: newButtons,
      overlap,
      ...options,
    });
  }

  render() {
    const { modals } = this.state;
    return <View styles={{ zIndex: 999 }}>
      {modals.map((modal, idx) => {
        return this._createModal(modal, idx);
      })}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  innerContentContainer: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  contentContainer: {
    backgroundColor: 'transparent',
  },
  bubbleContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
  bubble: {
    width: circleRadius * 2,
    height: circleRadius * 2,
    borderRadius: circleRadius,
    backgroundColor: COLORS.danger,
    // borderWidth: 2,
    borderColor: '#ffffff',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 0,
  },
  titleText: {
    color: '#1A1A1A',
    fontSize: 18,
    textAlign: 'center',
  },
  // body: { flex: 0 },
  bodyTextStyle: {
    color: '#373737',
  },
  footer: {
    flex: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: { flex: 1 },
  buttonText: { fontSize: 16 },
  buttonTextContainer: {
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
