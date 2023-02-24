/*
 ===== EXAMPLE ======

 <SelectModalWidget
    widgetStyles={{
        title: {
          display: 'none'
        },
        rowContainer: {
          borderWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#cccccc',
          borderRadius: 2,
          backgroundColor: '#ffffff',
          paddingLeft: 10,
          height: 43,
          marginBottom: 13
        },
        row: { height: 41 },
        text: { fontSize: 14, color: '#999999' }
    }}
    title="Result"
    placeholder="Result"
    name="result"
    scrollEnabled={false}
    formName={'form'}
  >
    <GiftedForm.SelectWidget name='result' title='Result' multiple={false}>
      <OptionWidget title={'Options 1'} value={'1'} key={1} />
      <OptionWidget title={'Options 2'} value={'2'} key={2} />
      <OptionWidget title={'Options 3'} value={'3'} key={3} />
    </GiftedForm.SelectWidget>
  </SelectModalWidget>

 */

import debounce from 'lodash/debounce';
import React from 'react';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { GiftedFormManager } from '@nois/react-native-gifted-form';
import I18n from 'react-native-i18n';

import Strings from '../../components/I18n/Strings';
import Colors from '../../constants/Colors';
import MyText from '../../components/myText/MyText';

export default class SelectModalWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      value: props.value,
      isShowSearch: false,
    };

    this.onChangeDelay = debounce(this.onSearch, 300);
    this.toggleModal = this.toggleModal.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.onClose = this.onClose.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.unSelectAll = this.unSelectAll.bind(this);
    this.updateFormValue = this.updateFormValue.bind(this);
    this.renderRightIcon = this.renderRightIcon.bind(this);
    this.renderLeftIcon = this.renderLeftIcon.bind(this);
  }

  componentDidMount() {
    this.updateFormValue(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value }, () => {
        this.updateFormValue(nextProps.value);
      });
    }
  }

  onPress = () => {
    if (this.props.readOnly) {
      return;
    }
    this.toggleModal();
  };

  getStyle(name) {
    return this.props.widgetStyles ? this.props.widgetStyles[name] : {};
  }

  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen,
      keywords: '',
      isShowSearch: false,
    });
  }

  toggleSearchBar = () => {
    this.setState({ isShowSearch: !this.state.isShowSearch }, () => {
      // if show search when focus text input
      if (this.state.isShowSearch) {
        this.textInput.focus();
      }
    });
  };

  onClose() {

  }

  onSelect(value) {
    this.toggleModal();
    this.updateFormValue(value);

    this.setState({ value }, () => {
      if (this.props.onSelect) {
        this.props.onSelect(value);
      }
    });
  }

  updateFormValue(value) {
    GiftedFormManager.updateValue(this.props.formName, this.props.name, value);
    this.props.onValueChange && this.props.onValueChange();
  }

  unSelectAll() {

  }

  getItemLayout = (data, index) => {
    const heightAVG = 45;
    return {
      length: heightAVG,
      offset: heightAVG * index, index,
    };
  };

  onSearch = (text) => {
    this.setState({ keywords: text });
  };

  renderRightIcon() {
    const { rightIcon, textColor } = this.props;
    const textValueColor = textColor ? textColor : Colors.textDark;

    if (!rightIcon) {
      return null;
    }
    return (
      <Icon
        iconStyle={{ height: 20 }}
        name='keyboard-arrow-down'
        size={25}
        color={textValueColor}
        containerStyle={{ marginTop: -5 }}
      />
    );
  }

  renderLeftIcon() {
    const { leftIcon } = this.props;
    if (!leftIcon) {
      return null;
    }
    return <View>{leftIcon}</View>;
  }

  renderLeftButtonNavigation() {
    const { iconContainer } = styles;
    return (
      <TouchableOpacity
        style={[iconContainer, { marginLeft: 5 }]}
        onPress={this.toggleModal}>
        <Icon
          name='close'
          size={30}
          color={Colors.primaryConstraint}
        />
      </TouchableOpacity>
    );
  }

  renderRightButtonNavigation() {
    const { iconContainer } = styles;
    return (
      <TouchableOpacity
        style={[iconContainer, { marginRight: 5 }]}
        onPress={this.toggleSearchBar}
      >
        <Icon
          name='search'
          size={30}
          color={Colors.primaryConstraint}
        />
      </TouchableOpacity>
    );
  }

  renderCenterHeader() {
    const { headerCenterContainer } = styles;

    if (this.state.isShowSearch) {
      return this.renderSearch();
    }
    return (
      <View style={headerCenterContainer}>
        <MyText
          style={{
            fontSize: 16,
            color: Colors.primaryConstraint,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          {this.props.placeholder}
        </MyText>
      </View>
    );
  }

  renderSearch() {
    const { headerCenterContainer, textInputContainer } = styles;
    return (
      <View style={headerCenterContainer}>
        <TextInput
          disableFullscreenUI={true}
          ref={(ref) => this.textInput = ref}
          placeholderTextColor={Colors.greyBorder}
          style={textInputContainer}
          underlineColorAndroid='transparent'
          onChangeText={this.onChangeDelay}
          placeholder={I18n.t(Strings.SEARCH)}
        />
      </View>
    );
  }

  renderValueOrPlaceholder() {
    const { placeholderColor, placeholder, data, textColor } = this.props;
    const inputPlaceholderColor = placeholderColor ?
      placeholderColor : Colors.textDark;
    const item = data.find(values => values.id === this.state.value);
    const displayText = item ? item.name : placeholder;
    const textValueColor = textColor ? textColor : Colors.textDark;

    return (
      <Text
        numberOfLines={1}
        style={[
          styles.valueText,
          this.getStyle('textStyle'), {
            color: item ? textValueColor : inputPlaceholderColor,
            fontSize: 16,
          }]}>
        {displayText}
      </Text>
    );
  }

  renderList() {
    const { keywords } = this.state;
    let childrenElement = this.props.children;
    let list = [];
    if (keywords && keywords.length > 0) {
      list = childrenElement.filter(item => item.props.title.toLowerCase().
        includes(keywords.toLowerCase()));
    }
    else {
      list = childrenElement;
    }

    const renderElement = (child) => {
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
        isSelected: this.state.value === child.props.value,
      });
    };

    return (
      <FlatList
        ListEmptyComponent={
          <MyText
            style={{ textAlign: 'center', marginTop: 30, fontSize: 20 }}>
            {I18n.t(Strings.NO_DATA)}
          </MyText>
        }
        removeClippedSubviews={true}
        renderItem={({ item }) => renderElement(item)}
        data={list}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  renderModal() {
    const { isOpen } = this.state;
    const { headerContainer } = styles;

    return (
      <Modal
        visible={isOpen} presentationStyle="fullScreen"
        transparent={false} animationType={'slide'}
        onRequestClose={() => {
        }}>
        <View style={headerContainer}>
          {this.renderLeftButtonNavigation()}
          {this.renderCenterHeader()}
          {this.renderRightButtonNavigation()}
        </View>
        {this.renderList()}
      </Modal>
    );
  }

  renderErrorMessage() {
    const { touched, errors } = this.props;
    const isInvalid = touched && errors !== null;
    const { textError } = styles;

    if (isInvalid) {
      return <MyText style={textError}>{errors}</MyText>;
    }
    return null;
  }

  render() {
    const { rowContainer, contentContainer, wrapper, textContainer, wrapperError } = styles;
    const { touched, errors } = this.props;
    const isInvalid = touched && errors !== null;

    return (
      <View style={[rowContainer, this.getStyle('rowContainer')]}>
        <TouchableOpacity
          style={
            [
              wrapper,
              this.getStyle('wrapper'),
              isInvalid ? wrapperError : {},
            ]
          }
          activeOpacity={this.props.activeOpacity ?
            this.props.activeOpacity : 0.8}
          onPress={this.onPress}>
          <View style={[contentContainer, this.getStyle('contentContainer')]}>
            <View style={[textContainer, this.getStyle('textContainer')]}>
              {this.renderLeftIcon()}
              {this.renderValueOrPlaceholder()}
            </View>
            {this.renderRightIcon()}
          </View>
          {this.renderModal()}
        </TouchableOpacity>
        {this.renderErrorMessage()}
      </View>
    );
  }
};

const styles = {
  rowContainer: {
    // some styles in here
  },
  wrapper: {
    backgroundColor: Colors.primaryConstraint,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE2F0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 6,
  },
  wrapperError: {
    borderColor: Colors.danger,
    borderWidth: 2,
    borderBottomWidth: 2,
    borderBottomColor: Colors.danger,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0,
    height: 33,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    height: 50,
  },
  headerCenterContainer: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 15,
  },
  textContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
  text: {
    fontSize: 15,
    color: Colors.blackPrimary,
  },
  closeButton: {
    paddingHorizontal: 5,
  },
  valueText: {
    fontSize: 18,
    color: Colors.blackPrimary,
  },
  textError: {
    margin: 5,
    fontSize: 12,
    color: Colors.danger,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    color: Colors.primaryConstraint,
    height: 50,
  },
  iconContainer: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
