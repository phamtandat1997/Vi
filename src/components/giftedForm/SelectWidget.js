/*
 ===== EXAMPLE ======

 onFormValueChange(values) {
    this.setState({form: values});
 }

 <SelectWidget
    title="Result"
    placeholder="Result"
    name="result"
    scrollEnabled={false}
    formName={'form'}
    value={this.state.form.result}
    onValueChange={this.onFormValueChange.bind(this)}
  >
    <OptionWidget title={'Options 1'} value={'1'} key={1} />
    <OptionWidget title={'Options 2'} value={'2'} key={2} />
    <OptionWidget title={'Options 3'} value={'3'} key={3} />
  </SelectWidget>

 */


import * as _ from 'lodash';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  FlatList
} from 'react-native';
import { SearchBar, Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  GiftedFormManager
} from '@nois/react-native-gifted-form';
import I18n from "react-native-i18n";
import Colors from "../../constants/Colors";

export default class SelectWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      title: props.title,
      text: props.displayValue || '',
      value: props.value,
      search: props.search || false,
      searchDelay: props.searchDelay || 500,
    };

    this.updateSearchValue = _.debounce((keywords) => {
      this.setState({ keywords });
    }, this.state.searchDelay);
    this.toggleModal = this.toggleModal.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.onClose = this.onClose.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.unSelectAll = this.unSelectAll.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);

  }


  onPress() {
    this.toggleModal();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.displayValue) {
      this.setState({ text: nextProps.displayValue });
    }
  }

  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen,
      keywords: ''
    });
  }

  getStyle(name) {
    return this.props.widgetStyles ? this.props.widgetStyles[name] : {};
  }

  onClose(ti, vl) {
    this.setState({ text: ti });
  }

  onSelect(vl, selected) {
    if (!this.props.multiple) {
      this.toggleModal();
      this.updateFormValue(vl);
      // if (this.props.onSelected) {
      //   this.props.onSelected(vl);
      // }
      this.setState({ value: vl });
      this.props.onValueChange && this.props.onValueChange(vl);
    } else {
      let values = this.state.value || [];
      let index = values.findIndex((v) => v === vl);
      if (index > -1 && !selected) {
        values.splice(index, 1);
        this.updateFormValue(values);
        this.setState({ value: values });
        this.props.onValueChange && this.props.onValueChange();
      } else if (index === -1 && selected) {
        values.push(vl);
        this.updateFormValue(values);
        this.setState({ value: values });
        this.props.onValueChange && this.props.onValueChange();
      }
    }
  }

  updateFormValue(vl) {
    GiftedFormManager.updateValue(this.props.formName, this.props.name, vl);
  }

  unSelectAll() {
    // React.Children.forEach(this._childrenWithProps, (child, idx) => {
    //   this.refs[child.ref]._onChange(false);
    // });
  }

  renderRightIcon() {
    return !!this.props.rightIcon ? this.props.rightIcon :
      <Icon name='keyboard-arrow-down' size={25} color={'#ECECEC'}/>;
  }

  renderSearchBar() {
    if (this.state.search) {
      return <SearchBar
        onChangeText={(keywords) => {
          this.updateSearchValue(keywords);
        }}
        onClear={() => {
          this.updateSearchValue('');
        }}
        lightTheme
      />
    }
  }


  render() {
    const { isOpen, keywords } = this.state;
    let childrenElement = this.props.children;
    const selectedOption = childrenElement.filter((o) => {
      if (this.props.multiple) {
        if (!this.props.value) {
          return false;
        } else {
          return this.props.value.findIndex(v => v === o.props.value) > -1;
        }
      } else {
        return o.props.value === this.props.value;
      }
      // this.props.multiple ? this.props.value.findIndex(v => v === o.props.value) > -1 : o.props.value === this.props.value
    });
    let text = this.state.text;
    if (selectedOption && selectedOption.length) { // empty
      if (selectedOption.length > 1) {
        text = (selectedOption[0].props.title || text) + ` (+${selectedOption.length - 1} ${I18n.t('OTHERS')})`;
      } else {
        text = selectedOption[0].props.title || text;
      }
    } else if (!text && (!selectedOption || !selectedOption.length)) {
      text = this.props.placeholder
    }
    let list = [];
    if (keywords) {
      list = _.filter(childrenElement, (i) => i.props.title.toLowerCase().indexOf(keywords.toLowerCase()) > -1);
    }
    else {
      list = childrenElement;
    }

    const renderElement = (child) => {
      let isSelected = false;
      if (this.props.multiple) {
        if (this.props.value) {
          isSelected = this.props.value.findIndex(v => v === child.props.value) > -1;
        }
      } else {
        isSelected = this.props.value === child.props.value;
      }
      return React.cloneElement(child, {
        formStyles: this.props.formStyles,
        formName: this.props.formName,
        name: this.props.name,
        multiple: this.props.multiple || false,
        onFocus: this.props.onFocus,
        onBlur: this.props.onBlur,
        onValidation: this.props.onValidation,
        onValueChange: this.props.onValueChange,
        onSelect: this.onSelect.bind(this),
        unSelectAll: this.unSelectAll.bind(this),
        onClose: this.onClose.bind(this),
        keywords: this.state.keywords,
        isSelected: isSelected
      });
    };

    return (
      <TouchableOpacity
        onPress={() => {
          this.onPress();
        }} style={[styles.rowContainer, this.getStyle('rowContainer')]}>
        <View style={[styles.row, this.getStyle('row')]}>
          {
            !!this.state.title && this.state.title.length > 0 &&
            <Text numberOfLines={1} style={[styles.title, this.getStyle('title')]}>{this.state.title}:</Text>
          }

          <View style={[styles.valueContainer, this.getStyle('valueContainer')]}>
            <View style={[styles.alignRight, this.getStyle('textContainer')]}>
              <Text numberOfLines={1}
                    style={[styles.value,
                      { color: !text ? '#8E8E93' : '#000000' },
                      this.getStyle('text')]}>{text}</Text>
            </View>

            <View style={{ flex: 0.1 }}>
              {this.renderRightIcon()}
            </View>

          </View>
        </View>
        <Modal visible={isOpen} presentationStyle="fullScreen" transparent={false} animationType={'slide'}
               onRequestClose={() => {
               }}>

          <Header
            leftComponent={<TouchableOpacity style={styles.closeButton} onPress={() => {
              this.toggleModal();
            }}><Icon name={'close'} size={23} color={Colors.primaryConstraint}/></TouchableOpacity>}
            centerComponent={{
              text: this.state.title || (this.props.multiple ? I18n.t('SELECT_MULTI') : I18n.t('SELECT_ONE')),
              style: { color: Colors.primaryConstraint }
            }}
            backgroundColor={Colors.darkOrange}
          />

          {this.renderSearchBar()}
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={list} renderItem={({ item }) =>
            renderElement(item)
          }>
          </FlatList>
        </Modal>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#3370C4',
    alignItems: 'center',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
  },
  rowContainer: {
    flex: 1,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 0,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    // height: 43,
    marginBottom: 0
  },
  row: {
    flexDirection: 'row',
    height: 41,
    alignItems: 'center'
  },
  title: {
    flex: 0.5,
    fontSize: 15,
    color: '#000',
    // paddingLeft: 10,
    // paddingBottom: 5
  },
  alignRight: {
    flex: 0.9,
    alignItems: 'flex-start',
    justifyContent: 'center'
    // width: 110,
  },
  text: {
    fontSize: 14,
    color: '#999999',
  },
  closeButton: {
    paddingHorizontal: 10
  },
  valueContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  value: {
    fontSize: 18
  },
  searchContainer: {
    backgroundColor: '#8E8E93',
    borderTopWidth: 0,
    borderBottomWidth: 0,

  },
  searchInput: {
    backgroundColor: '#fff'
  }
});
