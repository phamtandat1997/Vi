import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import { Icon } from 'react-native-elements';

export default class OptionWidget extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  getStyle(name) {
    let style = {};
    if (this.props.widgetStyles) {
      style = this.props.widgetStyles[name] || {};
    }
    return { ...styles[name], ...style };
  }

  renderCheckMark() {
    if (!!this.props.isSelected) {
      return (
          <Icon
              style={{ paddingHorizontal: 15 }}
              name={'check'}
              size={20}
              color={this.props.iconColor}
          />
      );
    }
    return null;
  }

  onClose = () => {
    if (this.props.multiple === false) {
      this.props.unSelectAll();

      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(this.props.value);
      }

      if (typeof this.props.onClose === 'function') {
        this.props.onClose(this.props.title, this.props.value);
      }
    } else {
      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(this.props.value, !this.state.value);
      }
    }
  };

  render() {
    return (
        <View style={this.getStyle('rowContainer')}>
          <TouchableOpacity
              onPress={this.onClose}
              underlayColor={'#c7c7cc'}
              {...this.props}
          >
            <View style={this.getStyle('row')}>
              <Text numberOfLines={1} style={[this.getStyle('switchTitle')]}>
                {this.props.title}
              </Text>
              {this.renderCheckMark()}
            </View>
          </TouchableOpacity>
        </View>
    );
  }
};

const styles = {
  rowContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#c8c7cc',
  },
  row: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  switchTitle: {
    fontSize: 15,
    flex: 1,
  },
};
