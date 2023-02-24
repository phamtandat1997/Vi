import React, { Component } from 'react';
import {
  ImageBackground,
  View,
} from 'react-native';
import I18n from 'react-native-i18n';

import { CurrentMarketSelectorButton } from '../../components/navigationButton';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import Colors from '../../constants/Colors';
import Strings from '../../components/I18n/Strings';
import MyText from '../../components/myText/MyText';
import { HeaderNavStyles } from '../../constants/Styles';
import MyButton from '../../components/myButton';
import Images from '../../constants/Images';
import Layout from '../../constants/Layout';
import { Store } from '../../store';
import { Dialog } from '../../components/dialog';

export default class SelectSupermarketScene extends Component {

  static navigationOptions = {
    ...HeaderNavStyles.NavBar,
    header: null,
  };

  constructor(props) {
    super(props);
  }

  haveGoToHome = () => {
    const selectedMarket = Store.getState().app.get('selectedMarket');
    if (selectedMarket !== 0) {
      this.props.navigation.navigate('Home');
    } else {
      Dialog.alertError(I18n.t(Strings.PLEASE_SELECT_SUPER_MARKET));
    }
  };

  render() {
    const { selectSuperMarketStyles, container, filterText, buttonStyles } = styles;

    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.ROOT}>
        <ImageBackground
          resizeMode={'stretch'}
          source={Images.BACKGROUND}
          style={container}
        >
          <MyText style={filterText}>
            {I18n.t(Strings.PLEASE_SELECT_SUPER_MARKET)}
          </MyText>
          <View
            style={{ flexGrow: 1, flexShrink: 1, justifyContent: 'center' }}>
            <CurrentMarketSelectorButton style={selectSuperMarketStyles}/>
            <MyButton
              onPress={this.haveGoToHome}
              containerStyle={buttonStyles}
              title={I18n.t(Strings.CONTINUE)}
            />
          </View>
        </ImageBackground>
      </BackHandlerProvider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexWrap: 'wrap',
    height: Layout.window.height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  layoutCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 26,
    color: Colors.primaryConstraint,
  },
  selectSuperMarketStyles: {
    container: {
      borderRadius: 3,
      borderColor: Colors.primaryConstraint,
      borderWidth: 1,
      paddingVertical: 5,
      paddingHorizontal: 5,
    },
    textStyle: {
      color: Colors.primaryConstraint,
    },
    selectWidgetStyles: {
      rowContainer: {
        flexGrow: 1,
      },
      wrapper: {
        borderWidth: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
      },
    },
    selector: {
      placeholderColor: Colors.primaryConstraint,
      textColor: Colors.primaryConstraint,
    },
  },
  buttonStyles: {
    marginTop: 15,
    backgroundColor: Colors.buttonPrimary,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
};