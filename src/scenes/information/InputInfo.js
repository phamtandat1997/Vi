import React, { Component } from 'react';
import { View } from 'react-native';
import I18n from 'react-native-i18n';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';

import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import Colors from '../../constants/Colors';
import { NavigationHeader } from '../../components/header/NavigationHeader';
import Strings from '../../components/I18n/Strings';
import MyButton from '../../components/myButton';
import DateTimePicker from '../../components/giftedForm/DateTimePicker';
import MyText from '../../components/myText/MyText';
import InfoList from '../../components/infomation/InfoList';
import InfoFactory from '../../factories/InfoFactory';
import QueryParam from '../../constants/QueryParam';
import WaitingView from '../../components/waitingView/WaitingView';
import { LayoutHeader } from '../../components/header/LayoutHeader';
import { Translate } from '../../components/I18n';
import ErrorView from '../../components/errorView';

const IMPORT_TYPE_ID = 0;

class InputInfo extends Component {

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

    this.pageSize = QueryParam.pageSize;
    this.dateFilter = moment(new Date()).toISOString();
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
    if (this.props.selectedMarket !== nextProps.selectedMarket) {
      this.initData(nextProps.selectedMarket);
    }
  }

  componentDidFocus() {
    this.initData(this.props.selectedMarket);
  }

  componentWillBlur() {
    this.setState({ inSideLoading: true });
    this.dateFilter = moment(new Date()).toISOString();
  }

  initData(supermarketId) {
    InfoFactory.getInformation({
      ...QueryParam,
      importTypeId: IMPORT_TYPE_ID,
      supermarketId,
      date: this.dateFilter,
    });
  }

  onNavigatePress = () => {
    this.props.navigation.navigate('ReturnInfo');
  };

  navigateInventory = () => {
    this.props.navigation.navigate('Inventories');
  };

  onSelectDate = (date) => {
    this.dateFilter = moment(date).format('MM-DD-YYYY');
    this.initData(this.props.selectedMarket);
  };

  onRefresh = () => {
    InfoFactory.getNewInformation({
      ...QueryParam,
      importTypeId: IMPORT_TYPE_ID,
      supermarketId: this.props.selectedMarket,
      date: this.dateFilter,
    });
  };

  onEndReached = () => {
    this.pageSize = this.pageSize + QueryParam.pageSize;
    InfoFactory.getOldInformation({
      ...QueryParam,
      importTypeId: IMPORT_TYPE_ID,
      supermarketId: this.props.selectedMarket,
      pageSize: this.pageSize,
      date: this.dateFilter,
    });
  };

  navigateCreateNote = () => {
    const importTypeId = this.isReturn ? 1 : 0;
    this.props.navigation.navigate('CreateOrUpdateNote', {
      date: this.dateFilter,
      importTypeId,
    });
  };

  renderNavigateButton() {
    return (
      <MyButton
        onPress={this.onNavigatePress}
        title={Translate('RETURN_INFORMATION')}
        containerStyle={{
          backgroundColor: Colors.unfilledSuccess,
          marginRight: 0,
          paddingVertical: 7,
        }}
        leftIcon={
          <Icon
            size={15}
            name={'reply'}
            type='font-awesome'
            color={Colors.primaryConstraint}
            containerStyle={{ marginRight: 5 }}
          />
        }
      />
    );
  }

  renderNoteButton() {
    return (
      <MyButton
        onPress={this.navigateCreateNote}
        containerStyle={{
          backgroundColor: Colors.buttonSecondary,
          marginRight: 10,
          paddingVertical: 7,
        }}
        title={I18n.t(Strings.NOTE)}
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

  renderInventoryButton() {
    return (
      <MyButton
        onPress={this.navigateInventory}
        containerStyle={{
          backgroundColor: Colors.orange,
          marginLeft: 10,
          paddingVertical: 7,
        }}
        title={I18n.t(Strings.INVENTORY)}
        leftIcon={
          <Icon
            size={15}
            name='hdd-o'
            type='font-awesome'
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
            {I18n.t(Strings.FILTER_BY_DATE)}
          </MyText>
          <DateTimePicker
            value={this.dateFilter}
            pickerProperties={{
              maximumDate: new Date().toISOString(),
            }}
            acceptTitle={I18n.t(Strings.SELECT)}
            cancelTitle={I18n.t(Strings.CANCEL)}
            onSelect={this.onSelectDate}
          />
        </View>
        <View style={layoutCenter}>
          {this.renderNoteButton()}
          {this.renderNavigateButton()}
          {this.renderInventoryButton()}
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
          <View style={{ flexGrow: 1, flexShrink: 1 }}>
            {(isLoading || inSideLoading) && error === null && <WaitingView/>}
            {error === null && !isLoading && !inSideLoading &&
            <InfoList
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}/>
            }
            {error !== null && !isLoading && !inSideLoading && <ErrorView/>}
          </View>
        </View>
      </BackHandlerProvider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 0,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  menuItemContainer: {
    width: '31.33%',
    marginHorizontal: '1%',
    backgroundColor: Colors.blackContrast,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
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
    isLoading: state.info.get('isLoading'),
    error: state.info.get('error'),
    selectedMarket: state.app.get('selectedMarket'),
  };
};

export default connect(mapStateToProps, null)(InputInfo);
