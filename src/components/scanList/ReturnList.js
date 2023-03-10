import React, { Component } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import KeyboardEvent from 'react-native-key-scanner';

import { Dialog } from '../dialog';
import Colors from '../../constants/Colors';
import ReturnFactory from '../../factories/ReturnFactory';
import BarcodeForm from '../barcodeForm/BarcodeForm';
import ItemLayout from './ItemLayout';
import EmptyMessage from './emptyMessage';
import ClearListButton from './clearListButton';
import NavigationButtonSaleAndReturn from './navigationButtonSaleAndReturn';
import { Translate } from '../I18n';
import SaleAndReturnItem from './SaleAndReturnItem';

export default class ReturnList extends Component {

  constructor() {
    super();

    this.state = {
      refreshing: false,
      items: null,
      type: -1,
    };
    this.didFocusListener = null;
    this.willBlurListener = null;
  }

  componentDidMount() {
    if (this.props.type !== undefined) {
      this.state.type = this.props.type;
    }

    this.didFocusListener = this.props.navigation.addListener('didFocus',
      () => this.componentDidFocus());
    this.willBlurListener = this.props.navigation.addListener('willBlur',
      () => this.componentWillBlur());
  }

  componentWillUnmount() {
    if (this.didFocusListener !== null) {
      this.didFocusListener.remove();
    }
    if (this.willBlurListener !== null) {
      this.willBlurListener.remove();
    }
    // KeyboardEvent.removeBarcodeScanner();
  }

  componentDidFocus() {
    KeyboardEvent.onBarcodeScanner(this.scanHandler);
  }

  componentWillBlur() {
    // KeyboardEvent.removeBarcodeScanner();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.items !== prevState.items) {
      return { items: nextProps.items };
    }
    return null;
  }

  scanHandler = async (value) => {
    await this.onAddItem(value.data);
  };

  async onAddItem(barcode) {
    await ReturnFactory.addItem3(barcode, this.state.type);
  }

  onReturnItem = (item) => {
    ReturnFactory.removeAndReturnItem(item, this.state.type);
  };

  inputBarcode = async (values, clearForm) => {
    if (values && values.trim().length > 0) {
      await this.onAddItem(values);
      clearForm();
    } else {
      Dialog.alertWarning('Vui l??ng nh???p m?? s???n ph???m', 'Ch?? ??');
    }
  };

  clearList = () => {
    ReturnFactory.clearAll(this.state.type);
  };

  onNavigatePress = () => {
    if (this.props.onNavigatePress) {
      this.props.onNavigatePress();
    }
  };

  renderNavigateButton() {
    return (
      <NavigationButtonSaleAndReturn
        onPress={this.onNavigatePress}
        title={Translate('SELL')}
      />
    );
  }

  renderClearListButton(hasData) {
    return <ClearListButton onPress={this.clearList} disable={!hasData}/>;
  }

  renderItem = ({ item, index }) => {
    return (
      <SaleAndReturnItem
        onPress={this.onReturnItem}
        item={item}
        index={index}
      />
    );
  };

  renderList() {
    const { items } = this.state;
    const data = !items ? [] : Object.values(items).reverse();

    return (
      <FlatList
        removeClippedSubviews={true}
        style={{ flex: 1, marginTop: 0 }}
        data={data}
        ListEmptyComponent={<EmptyMessage/>}
        keyExtractor={(item) => item.id.toString()}
        renderItem={this.renderItem}/>
    );
  }

  render() {
    const { refreshing, items } = this.state;
    const data = !items ? [] : Object.values(items).reverse();

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexGrow: 1 }}>
            <BarcodeForm onSubmit={this.inputBarcode}/>
          </View>
          <View style={{
            flexDirection: 'row',
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: 'white',
          }}>
            {this.renderNavigateButton()}
            {this.renderClearListButton(!!data.length)}
          </View>
        </View>
        <ItemLayout isHeader={true}/>
        {
          !!refreshing &&
          <View style={{
            backgroundColor: 'white',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: Colors.greyBorder,
          }}>
            <ActivityIndicator/>
          </View>
        }
        {this.renderList()}
      </View>
    );
  }
}
