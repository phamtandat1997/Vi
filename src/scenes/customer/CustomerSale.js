import React, { Component } from 'react';
import { connect } from 'react-redux';

import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import SaleList from '../../components/scanList/SaleList';
import TransactionType from '../../constants/TransactionType';
import { NavigationHeader } from '../../components/header/NavigationHeader';

class CustomerSaleScene extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: <NavigationHeader navigation={navigation}/>,
    };
  };

  constructor() {
    super();
  }

  onNavigatePress = () => {
    this.props.navigation.navigate('CustomerReturn');
  };

  render() {
    const { items } = this.props;
    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.MENU}>
        <SaleList
          items={items}
          type={TransactionType.CUSTOMER}
          onNavigatePress={this.onNavigatePress}
          navigation={this.props.navigation}
        />
      </BackHandlerProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.customer && state.customer.get('saleBarcode') || null,
  };
};

export default connect(mapStateToProps, null)(CustomerSaleScene);
