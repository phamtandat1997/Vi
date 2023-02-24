import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import MarketFactory from '../../factories/MarketFactory';
import Images from '../../constants/Images';
import Colors from '../../constants/Colors';
import ProductFactory from '../../factories/ProductFactory';
import Factories from '../../factories';
import CommonService from '../../utils/CommonService';

class WelcomeScene extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
  }

  componentDidMount() {
    ProductFactory.resetTradingError();
    CommonService.resetAppError();
    requestAnimationFrame(async () => {
      await this.initData();
    });
  }

  async initData() {
    const { isAuth, navigation, selectedMarket } = this.props;

    if (!!isAuth) {
      try {
        if (!selectedMarket) {
          navigation.navigate('SelectSupermarket');
        } else {
          ProductFactory.getProducts();
          await CommonService.fetchVersion();
          await MarketFactory.getSuperMarkets();
          navigation.navigate('Home');
        }
      } catch (error) {
        if (__DEV__) {
          console.log('[ERROR] initData', error);
        }
        Factories.logOut();
        navigation.navigate('Login');
      }
    } else {
      navigation.navigate('Login');
    }
  }

  render() {
    const { container } = styles;

    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.ROOT}>
        <View style={container}>
          <Image
            resizeMode='contain'
            source={Images.LOGO}
            style={{
              width: 300,
              height: 100,
              marginBottom: 10,
            }}
          />
          <ActivityIndicator color={Colors.primary}/>
        </View>
      </BackHandlerProvider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.primaryConstraint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHeader: {
    fontSize: 24,
    textAlign: 'center',
    color: Colors.primaryConstraint,
    marginVertical: 40,
  },
};

const mapStateToProps = state => {
  const { auth, app } = state;

  return {
    isAuth: auth.get('isAuth'),
    selectedMarket: app.get('selectedMarket'),
  };
};

export default connect(mapStateToProps, null)(WelcomeScene);