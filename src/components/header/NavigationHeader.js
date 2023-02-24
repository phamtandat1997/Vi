import React, { PureComponent } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import I18n from 'react-native-i18n';

import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';
import {DrawerButton} from '../navigationButton';
import CurrentMarketText from '../navigationButton/CurrentMarketText';
import AllFactories from '../../factories';

export class NavigationHeader extends PureComponent {

  constructor() {
    super();
  }

  logout = async () => {
    try {
      await AllFactories.logOut();
      this.props.navigation.navigate('Auth');
    }
    catch (e) {
      console.log('logout failed', e);
    }
  };

  goHome = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    const { container, textLogo } = styles;
    const title = this.props.navigation.getParam('title') || this.props.title;
    const isHome = this.props.navigation.state.routeName === 'Home';

    return (
        <View style={container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DrawerButton
                style={{ marginLeft: 0 }}
                navigation={this.props.navigation}
            />
            <MyText style={textLogo}>{title ? I18n.t(title) : 'VISSAN'}</MyText>
          </View>
          <CurrentMarketText/>
          <TouchableOpacity onPress={isHome ? this.logout : this.goHome}>
            <Icon
                name={isHome ? 'sign-out' : 'home'}
                type='font-awesome'
                size={30}
                color={Colors.primaryConstraint}
            />
          </TouchableOpacity>
        </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 15,
    evaluate: 4,
  },
  textLogo: {
    color: Colors.primaryConstraint,
    fontWeight: '500',
    fontSize: 18,
    marginLeft: 10,
  },
  logoContainer: {
    paddingLeft: 0,
  },
};