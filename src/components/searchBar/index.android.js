import React from 'react';
import { View } from 'react-native';
import debounce from 'lodash/debounce';

import Colors from '../../constants/Colors';
import SearchBar from './SearchBar';
import { Translate } from '../I18n';

export default class SearchBarCustom extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
    };
    // trigger on change text after 500ms
    this.onChangeTextDelayed = debounce(this.onChangeText, 500);
    this.onClearText = this.onClearText.bind(this);
  }

  onChangeText(text) {
    if (this.props.onChangeText) {
      if (text.trim().length > 0) {
        text = text.trim();
        this.setState({ keyword: text });
        this.props.onChangeText(text);
      } else {
        this.onClearText();
      }
    }
  };

  onClearText() {
    if (this.props.onClearText) {
      this.setState({ keyword: '' });
      this.props.onClearText();
    }
  }

  onSubmitEditing = () => {
    if (this.props.onSubmitEditing) {
      this.props.onSubmitEditing();
    }
  };

  show() {
    const { keyword } = this.state;

    this.searchBar.show();
    if (keyword.trim().length > 0) {
      this.searchBar.setValue(keyword.trim());
      this.props.onChangeText(keyword.trim());
    }
  }

  hide() {
    this.searchBar.hide();
  }

  setValue(value) {
    setTimeout(() => {
      if (this.searchBar) {
        this.searchBar.setValue(value);
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder={this.props.placeholder ?
            this.props.placeholder :
            Translate('SEARCH')}
          wrapperStyle={{
            borderBottomColor: Colors.greyBorder,
            borderBottomWidth: 2,
          }}
          heightAdjust={-6}
          handleChangeText={(text) => this.onChangeTextDelayed(text)}
          onSubmitEditing={this.onSubmitEditing}
          ref={(ref) => this.searchBar = ref}
          onX={this.onClearText}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    top: -56,
  },
};