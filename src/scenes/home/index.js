import React, { Component } from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';
import I18n from 'react-native-i18n';
import { Icon } from 'react-native-elements';

import MyText from '../../components/myText/MyText';
import Menu from '../../constants/Menu';
import Colors from '../../constants/Colors';
import { NavigationHeader } from '../../components/header/NavigationHeader';
import Images from '../../constants/Images';
import Layout from '../../constants/Layout';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import ProductFactory from '../../factories/ProductFactory';
import PermissionService, { PERMISSION } from '../../utils/PermissionService';
import CommonService from '../../utils/CommonService';

export default class HomeScene extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: <NavigationHeader navigation={navigation}/>,
    };
  };

  constructor() {
    super();
  }

  componentDidMount() {
    ProductFactory.fetchPurchases();
    CommonService.runBackgroundSendDeviceInfo();
    CommonService.sendDeviceInfoWhen15();

    this.props.navigation.addListener('didFocus',
      () => this.componentDidFocus());
  }

  async componentDidFocus() {
    StatusBar.setBackgroundColor(Colors.blackOrigin, false);
    StatusBar.setTranslucent(false);

    const permissionStorage = await PermissionService.check('storage');

    if (permissionStorage === PERMISSION.authorized) {
      await CommonService.checkUpdate();
    } else {
      this.props.navigation.navigate('Permission');
    }
  }

  componentWillUnmount() {
    ProductFactory.clearIntervalFetchPurchases();
    CommonService.clearIntervalSendInfo();
  }

  onMenuItemPress = ({ link, title }) => {
    this.props.navigation.navigate(link, { title });
  };

  renderIcon(icon) {
    if (typeof icon === 'number') {
      return (
        <Image
          source={icon}
          style={{ width: 50, height: 50 }}
          resizeMode='contain'
        />
      );
    }
    return (
      <Icon
        color={Colors.primaryConstraint}
        name={typeof icon === 'string' ? icon : icon.name}
        size={30}
        type={typeof icon === 'string' ? 'material' : icon.type}
      />
    );
  }

  renderMenuItem(item, index) {
    const { menuItemContainer, menuItemText } = styles;
    const { name, title, link, shadow } = item;

    return (
      <TouchableOpacity
        onPress={() => this.onMenuItemPress({ link, title })}
        activeOpacity={0.5}
        style={menuItemContainer}
        key={index}>
        {this.renderIcon(shadow)}
        <MyText style={menuItemText}>{I18n.t(name)}</MyText>
      </TouchableOpacity>
    );
  }

  render() {
    const { container } = styles;

    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.ROOT}>
        <ImageBackground
          resizeMode={'stretch'}
          source={Images.BACKGROUND}
          style={container}
        >
          {Menu.map((item, index) => this.renderMenuItem(item, index))}
        </ImageBackground>
      </BackHandlerProvider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: Layout.window.height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  buttonContainer: {
    marginTop: 0,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  menuItemContainer: {
    width: '33.33%',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 22,
    color: Colors.primaryConstraint,
    marginTop: 5,
  },
};
