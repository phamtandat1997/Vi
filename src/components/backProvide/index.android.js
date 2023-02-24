import * as React from 'react';
import { withNavigation } from 'react-navigation';
import { BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Dialog as DialogService } from '../dialog';
import { Translate } from '../I18n';

const TYPE = {
  ROOT: 'ROOT',
  MENU: 'MENU',
  CHILD: 'CHILD',
};

export const TYPE_NAVIGATION = TYPE;

class BackHandlerAndroid extends React.Component {

  constructor(props) {
    super(props);

    this.backListener = null;
    this.goBackDelay = debounce(this.goBack, 300);
  }

  componentDidMount() {
    if (this.props.type === TYPE.CHILD) {
      this.handleBack();
    } else {
      this.props.navigation.addListener('didFocus',
        () => this.componentDidFocus());

      this.props.navigation.addListener('willBlur',
        () => this.componentWillBlur());
    }
  }

  handleBack = () => {
    this.backListener = BackHandler.addEventListener('backPress', () => {
      this.goBackDelay();
      this.props.onBackPress && this.props.onBackPress();
      return true;
    });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  componentDidFocus() {
    this.backListener = BackHandler.addEventListener('backPress', () => {
      const { type } = this.props;
      if (type === TYPE.CHILD) {
        this.props.navigation.goBack();
      } else if (type === TYPE.MENU) {
        this.props.navigation.navigate('Home');
      } else {
        DialogService.confirm(Translate('DO_YOU_WANT_TO_EXIT_APP'), (r) => {
          if (r) {
            BackHandler.exitApp();
          }
        });
      }
      this.props.onBackPress && this.props.onBackPress();
      return true;
    });
  }

  componentWillBlur() {
    if (this.backListener !== null) {
      this.backListener.remove();
    }
  }

  render() {
    return this.props.children || null;
  }
}

BackHandlerAndroid.propTypes = {
  type: PropTypes.oneOf([TYPE.ROOT, TYPE.MENU, TYPE.CHILD]).isRequired,
  onBackPress: PropTypes.func,
};
const BackHandlerProvider = withNavigation(BackHandlerAndroid);

export default BackHandlerProvider;

