import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { Icon } from 'react-native-elements';
import I18n from 'react-native-i18n';

import Colors from '../../constants/Colors';
import MyText from '../../components/myText/MyText';

export default class MenuItem extends Component {

  constructor() {
    super();

    this.state = {
      isCollapsed: true,
    };
  }

  menuItemPress = () => {
    const child = this.props.item.child;

    if (child && child.length > 0) {
      this.setState({ isCollapsed: !this.state.isCollapsed });
    } else {
      if (this.props.item.link && this.props.menuItemPress) {
        this.props.menuItemPress({
          link: this.props.item.link,
          name: this.props.item.title,
        });
      }
    }
  };

  onSubMenuPress = (item) => {
    if (item.link && this.props.menuItemPress) {
      this.props.menuItemPress({
        link: item.link,
        name: item.title,
      });
    }
  };

  renderIcon(icon) {
    if (typeof icon === 'number') {
      return (
        <Image
          source={icon}
          style={{ width: 20, height: 20 }}
          resizeMode='contain'
        />
      );
    }
    return (
      <Icon
        color={Colors.primaryConstraint}
        name={typeof icon === 'string' ? icon : icon.name}
        size={22}
        type={typeof icon === 'string' ? 'material' : icon.type}
      />
    );
  }

  renderSubMenu(item, index) {
    const { layoutCenter } = styles;
    const { name } = item;

    return (
      <TouchableOpacity
        onPress={() => this.onSubMenuPress(item)}
        style={[
          layoutCenter,
          { marginLeft: 25, paddingTop: 10 }]}
        key={index}>
        <MyText style={{ color: Colors.primaryConstraint, fontSize: 16 }}>
          {I18n.t(name)}
        </MyText>
      </TouchableOpacity>
    );
  }

  renderCollapse() {
    const child = this.props.item.child;
    const { isCollapsed } = this.state;

    if (child && child.length > 0) {
      return (
        <Collapsible collapsed={isCollapsed}>
          {child.map(
            (item, index) => this.renderSubMenu(item, index))}
        </Collapsible>
      );
    }
    return null;
  }

  render() {
    const { name, icon } = this.props.item;
    const { container, layoutCenter, menuItemText } = styles;
    const child = this.props.item.child;

    return (
      <View style={container}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            layoutCenter,
            { justifyContent: 'space-between' }]}
          onPress={this.menuItemPress}>
          <View style={layoutCenter}>
            {this.renderIcon(icon)}
            <MyText style={menuItemText}>
              {I18n.t(name)}
            </MyText>
          </View>
          {child && child.length > 0 && <Icon
            containerStyle={{ alignItems: 'flex-end' }}
            color={Colors.greyPrimary}
            name={'keyboard-arrow-down'}
            size={18}
          />}
        </TouchableOpacity>
        {this.renderCollapse()}
      </View>
    );
  }
}

const styles = {
  container: {
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: '#979797',
    paddingHorizontal: 10,
  },
  layoutCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    flexShrink: 1,
    flexGrow: 1,
  },
  menuItemText: {
    color: Colors.greyPrimary,
    fontSize: 17,
    marginLeft: 10,
  },
};