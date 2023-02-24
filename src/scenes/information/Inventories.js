import React, { Component } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import { NavigationHeader } from '../../components/header/NavigationHeader';
import Colors from '../../constants/Colors';
import { LayoutHeader } from '../../components/header/LayoutHeader';
import MyButton from '../../components/myButton';
import MyText from '../../components/myText/MyText';
import DateTimePicker from '../../components/giftedForm/DateTimePicker';
import { Translate } from '../../components/I18n';
import InventoryFactory from '../../factories/InventoryFactory';
import QueryParam from '../../constants/QueryParam';
import WaitingView from '../../components/waitingView/WaitingView';
import InventoryList from '../../components/inventory/InventoryList';
import ErrorView from '../../components/errorView';

class InventoriesScene extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: <NavigationHeader navigation={navigation}/>,
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      inSideLoading: true,
    };
    this.dateFilter = moment(new Date()).format('YYYY-MM-DD');
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus',
      () => this.componentDidFocus());

    this.props.navigation.addListener('willBlur',
      () => this.componentWillBlur());
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading && !!this.state.inSideLoading) {
      this.setState({ inSideLoading: false });
    }
  }

  componentDidFocus() {

    this.getInventories();
  }

  componentWillBlur() {
    this.setState({ inSideLoading: true });
    this.dateFilter = moment(new Date()).format('YYYY-MM-DD');
  }

  generateParams(data?) {
    data = data ? data : {};

    return {
      ...QueryParam,
      applyDate: this.dateFilter,
      ...data,
    };
  }

  getInventories() {
    const params = this.generateParams();
    InventoryFactory.getInventories(params);
  }

  onRefresh = () => {
    const params = this.generateParams();
    InventoryFactory.getNewInventories(params);
  };

  onEndReached = () => {
    this.pageSize = this.pageSize + QueryParam.pageSize;
    const params = this.generateParams({
      pageSize: this.pageSize,
    });
    InventoryFactory.getOldInventories(params);
  };

  navigateCreateInventory = () => {
    this.props.navigation.navigate('CreateInventory');
  };

  onSelectDate = (date) => {
    this.dateFilter = moment(date).format('MM-DD-YYYY');
    this.getInventories();
  };

  renderNoteButton() {
    return (
      <MyButton
        onPress={this.navigateCreateNote}
        containerStyle={{
          backgroundColor: Colors.buttonSecondary,
          marginRight: 10,
          paddingVertical: 7,
        }}
        title={Translate('NOTE')}
        leftIcon={
          <Icon
            size={15}
            name='edit'
            type='font-awesome'
            color={Colors.primaryConstraint}
            containerStyle={{ marginRight: 5 }}
          />
        }
      />
    );
  }

  renderCreateInventory() {
    return (
      <MyButton
        onPress={this.navigateCreateInventory}
        containerStyle={{
          backgroundColor: Colors.buttonPrimary,
          marginLeft: 10,
          paddingVertical: 7,
        }}
        title={Translate('CREATE_NEW_INVENTORY')}
        leftIcon={
          <Icon
            size={15}
            name='add'
            color={Colors.primaryConstraint}
            containerStyle={{ marginRight: 5 }}
          />
        }
      />
    );
  }

  renderHeader() {
    const { layoutCenter, filterText } = styles;

    return (
      <LayoutHeader>
        <View style={layoutCenter}>
          <MyText style={filterText}>
            {Translate('FILTER_BY_DATE')}
          </MyText>
          <DateTimePicker
            pickerProperties={{
              maximumDate: new Date().toISOString(),
            }}
            value={this.dateFilter}
            acceptTitle={Translate('SELECT')}
            cancelTitle={Translate('CANCEL')}
            onSelect={this.onSelectDate}
          />
        </View>
        <View style={layoutCenter}>
          {this.renderCreateInventory()}
        </View>
      </LayoutHeader>
    );
  }

  render() {
    const { inSideLoading } = this.state;
    const { isLoading, error } = this.props;

    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.MENU}>
        <View style={{ flex: 1 }}>
          {this.renderHeader()}
          {error !== null && !isLoading && !inSideLoading && <ErrorView/>}
          {(isLoading || inSideLoading) && <WaitingView/>}
          {!isLoading && !inSideLoading && error === null && <InventoryList
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}/>
          }
        </View>
      </BackHandlerProvider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.primaryConstraint,
  },
  layoutCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 16,
    color: Colors.blackPrimary,
    textDecorationLine: 'underline',
  },
};

const mapStateToProps = state => {
  return {
    isLoading: state.inventory.get('isLoading'),
    error: state.inventory.get('error'),
  };
};

export default connect(mapStateToProps, null)(InventoriesScene);