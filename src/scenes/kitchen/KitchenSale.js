import React, { Component } from 'react';
import { View } from 'react-native';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import { connect } from 'react-redux';
import SaleList from '../../components/scanList/SaleList';
import TransactionType from '../../constants/TransactionType';
import { NavigationHeader } from '../../components/header/NavigationHeader';
import Strings from '../../components/I18n/Strings';

class KitchenSaleScene extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: <NavigationHeader navigation={navigation}/>,
    };
  };

  constructor() {
    super();
  }

  onNavigatePress = () => {
    this.props.navigation.navigate('KitchenReturn');
  };

  render() {
    const { items } = this.props;
    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.MENU}>
        <SaleList
          items={items}
          type={TransactionType.KITCHEN}
          onNavigatePress={this.onNavigatePress}
          navigation={this.props.navigation}
        />
      </BackHandlerProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.kitchen && state.kitchen.get('saleBarcode') || null,
  };
};

export default connect(mapStateToProps, null)(KitchenSaleScene);
