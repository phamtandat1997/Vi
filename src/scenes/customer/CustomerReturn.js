import React, { Component } from 'react';
import { connect } from 'react-redux';

import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import ReturnList from '../../components/scanList/ReturnList';
import TransactionType from '../../constants/TransactionType';
import { NavigationHeader } from '../../components/header/NavigationHeader';

class CustomerReturnScene extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: <NavigationHeader navigation={navigation}/>,
    };
  };

  constructor() {
    super();
  }

  onNavigatePress = () => {
    this.props.navigation.navigate('CustomerSale');
  };

  render() {
    const { items } = this.props;
    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.MENU}>
        <ReturnList
          items={items}
          type={TransactionType.CUSTOMER_RETURN}
          onNavigatePress={this.onNavigatePress}
          navigation={this.props.navigation}
        />
      </BackHandlerProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.customer && state.customer.get('returnBarcode') || null,
  };
};

export default connect(mapStateToProps, null)(CustomerReturnScene);
