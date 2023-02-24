import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';

import AllFactories from '../../factories';
import Colors from '../../constants/Colors';
import Strings from '../I18n/Strings';
import UserInfo from './UserInfo';
import Menu from '../../constants/Menu';
import MenuItem from './MenuItem';
import { Store } from '../../store';
import MyText from '../myText/MyText';

const SIDE_BAR = [
  {
    roles: ['NhanVienQuay', 'NhanVienQuanLy'],
    name: Strings.HOME,
    link: 'Home',
    icon: 'home',
  },
  ...Menu,
  {
    roles: ['NhanVienQuanLy'],
    name: Strings.SETTING,
    title: Strings.SETTING,
    link: 'Config',
    icon: 'settings',
  },
];

export default class SideBar extends Component {

  constructor() {
    super();
  }

  closeDrawer() {
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  logout = async () => {
    try {
      this.closeDrawer();
      await AllFactories.logOut();
      this.props.navigation.navigate('Auth');
    } catch (e) {
    }
  };

  navigateTo = ({ link }) => {
    this.closeDrawer();
    this.props.navigation.navigate(link);
  };

  menuItemPress = async ({ link, name }) => {
    if (link === 'Logout') {
      await this.logout();
    } else {
      this.navigateTo({ link, name });
    }
  };

  renderMenu() {

    const { menuContainer } = styles;
    const userRole = Store.getState().auth.get('role');
    const userRoleArray = userRole.split(',');

    const menu = SIDE_BAR.filter(
      menu => menu.roles.find(role => {
        for (const item of userRoleArray) {
          if (role === item) {
            return role;
          }
        }
      }));

    return (
      <FlatList
        removeClippedSubviews={true}
        style={menuContainer}
        data={menu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MenuItem
            menuItemPress={this.menuItemPress}
            item={item}
          />
        )}
      />
    );
  }

  render() {
    const versionName = DeviceInfo.getVersion();

    return (
      <View style={styles.container}>
        <UserInfo/>
        {this.renderMenu()}
        <MyText style={styles.licenseText}>
          Phiên bản: {versionName}
        </MyText>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.blackContrast,
  },
  menuContainer: {
    flexShrink: 1,
    flexGrow: 1,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: '#979797',
    paddingHorizontal: 10,
  },
  menuItemText: {
    color: Colors.greyPrimary,
    fontSize: 16,
    marginLeft: 10,
  },
  licenseText: {
    color: Colors.primaryConstraint,
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 10,
  },
};
