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
import WaitingView from '../../components/waitingView/WaitingView';
import TransitionFactory from '../../factories/TransitionFactory';
import QueryParam from '../../constants/QueryParam';
import TransitionList from '../../components/transition/TransitionList';
import { LayoutHeader } from '../../components/header/LayoutHeader';
import MyText from '../../components/myText/MyText';
import DateTimePicker from '../../components/giftedForm/DateTimePicker';
import ErrorView from '../../components/errorView';

const TRANSFERS_TYPE = {
  SEND: 0,
  RECEIVED: 1,
};

class SendTransitionScene extends Component {

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
    this.isInput = false;
  }

  generateParams(data?) {
    data = data ? data : {};
    const { SEND } = TRANSFERS_TYPE;

    return {
      ...QueryParam,
      sortField: 'sendAt',
      orderDescending: true,
      supermarketId: this.props.selectedMarket,
      transferTypeId: SEND,
      sendAtFrom: this.dateFilter,
      sendAtTo: this.dateFilter,
      ...data,
    };
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
      this.initData({ supermarketId: nextProps.selectedMarket });
    }
  }

  componentDidFocus() {
    this.initData({ supermarketId: this.props.selectedMarket });
  }

  componentWillBlur() {
    this.setState({ inSideLoading: true });
    this.dateFilter = moment(new Date()).toISOString();
  }

  initData(params) {
    params = this.generateParams(params);
    TransitionFactory.getTransition(params);
  }

  onNavigatePress = () => {
    this.props.navigation.navigate('ReceivedTransition');
  };

  navigateDetail = (item) => {
    this.props.navigation.navigate('TransitionDetail', {
      id: item.id,
      isInput: this.isInput,
    });
  };

  openForm = () => {
    this.props.navigation.navigate('CreateTransitionInput');
  };

  onSelectDate = (date) => {
    this.dateFilter = moment(date).format('MM-DD-YYYY');
    this.initData({});
  };

  onRefresh = () => {
    const params = this.generateParams();
    TransitionFactory.getNewTransition(params);
  };

  onEndReached = () => {
    this.pageSize = this.pageSize + QueryParam.pageSize;
    const params = this.generateParams({ pageSize: this.pageSize });
    TransitionFactory.getOldTransition(params);
  };

  renderNavigateButton() {
    return (
      <MyButton
        onPress={this.onNavigatePress}
        title={I18n.t('INPUT_TRANSITION')}
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

  renderCreateNoteButton() {
    return (
      <MyButton
        onPress={this.openForm}
        containerStyle={{
          backgroundColor: Colors.buttonSecondary,
          marginRight: 10,
          paddingVertical: 7,
        }}
        title={I18n.t(Strings.CREATE)}
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

  renderHeader() {
    const { layoutCenter, filterText } = styles;

    return (
      <LayoutHeader>
        <View style={layoutCenter}>
          <MyText style={filterText}>
            {I18n.t(Strings.FILTER_BY_DATE)}
          </MyText>
          <DateTimePicker
            pickerProperties={{
              maximumDate: new Date().toISOString(),
            }}
            acceptTitle={I18n.t(Strings.SELECT)}
            cancelTitle={I18n.t(Strings.CANCEL)}
            onSelect={this.onSelectDate}
            value={this.dateFilter}
          />
        </View>
        <View style={layoutCenter}>
          {this.renderCreateNoteButton()}
          {this.renderNavigateButton()}
        </View>
      </LayoutHeader>
    );
  }

  render() {
    const { isLoading, error } = this.props;
    const { inSideLoading } = this.state;

    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.MENU}>
        <View style={{ flex: 1 }}>
          {this.renderHeader()}
          <View style={{ flexGrow: 1, flexShrink: 1 }}>
            {(isLoading || inSideLoading) && error === null && <WaitingView/>}
            {error !== null && !isLoading && !inSideLoading && <ErrorView/>}
            {!isLoading && !inSideLoading && error === null &&
            <TransitionList
              navigateDetail={this.navigateDetail}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
              isInput={this.isInput}
            />
            }
          </View>
        </View>
      </BackHandlerProvider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.buttonSecondary,
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
    isLoading: state.transition.get('isLoading'),
    error: state.transition.get('error'),
    selectedMarket: state.app.get('selectedMarket'),
  };
};

export default connect(mapStateToProps, null)(SendTransitionScene);