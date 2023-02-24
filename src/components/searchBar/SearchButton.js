import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import MyButton from '../myButton';
import debounce from 'lodash/debounce';

import Colors from '../../constants/Colors';

export default class SearchButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
    this.onChangeDelay = debounce(this.onChangeText, 500);
    this.keyword = '';
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isVisible !== nextState.isVisible;
  }

  onShow = () => {
    this.setState({ isVisible: true }, () => {
      if (this.textInput) {
        this.textInput.focus();
      }
    });
  };

  onHide = () => {
    this.setState({ isVisible: false }, () => {
      this.props.onClose && this.props.onClose();
      this.keyword = '';
    });
  };

  onChangeText = (text) => {
    this.keyword = text;
    this.props.onChangeText && this.props.onChangeText(text);
  };

  onSubmitEditing = () => {
    this.props.onSearch && this.props.onSearch(this.keyword);
  };

  render() {
    if (this.state.isVisible) {
      return (
        <View style={styles.searchContainer}>
          <TextInput
            ref={ref => this.textInput = ref}
            style={styles.searchInput}
            placeholder={'Tìm kiếm loại thịt'}
            onChangeText={this.onChangeDelay}
            onSubmitEditing={this.onSubmitEditing}
          />
          <TouchableOpacity onPress={this.onHide}>
            <Icon size={20} name={'clear'}/>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <MyButton
        containerStyle={{ backgroundColor: Colors.buttonSecondary }}
        rightIcon={<Icon
          containerStyle={{ marginLeft: 7 }}
          size={20}
          color={Colors.primaryConstraint}
          name={'search'}
        />}
        onPress={this.onShow}
        title={'Tìm kiếm'}
      />
    );
  }
}

const styles = {
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 5,
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'space-between',
    marginLeft: 20,
    borderColor: Colors.grey,
    borderRadius: 3,
    paddingVertical: 2,
  },
  searchInput: {
    margin: 0,
    padding: 0,
    fontSize: 16,
    flexGrow: 1,
    flexShrink: 1,
  },
};