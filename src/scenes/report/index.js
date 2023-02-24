import React, { Component } from 'react';
import { View } from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';

import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import Colors from '../../constants/Colors';
import { NavigationHeader } from '../../components/header/NavigationHeader';
import Strings from '../../components/I18n/Strings';
import WaitingView from '../../components/waitingView/WaitingView';
import QueryParam from '../../constants/QueryParam';
import { LayoutHeader } from '../../components/header/LayoutHeader';
import MyText from '../../components/myText/MyText';
import ReportFactory from '../../factories/ReportFactory';
import DateTimePicker from '../../components/giftedForm/DateTimePicker';
import ReportList from '../../components/report/ReportList';
import ErrorView from '../../components/errorView';
import SearchButton from '../../components/searchBar/SearchButton';
import fromReport from '../../store/report';

class ReportScene extends Component {

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
    this.dateFilter = moment(new Date()).format('YYYY-MM-DD');
    this.keyword = '';
  }

  generateParams(data?) {
    data = data ? data : {};

    return {
      ...QueryParam,
      supermarketId: this.props.selectedMarket,
      date: this.dateFilter,
      ...data,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus',
      () => this.componentDidFocus());

    this.props.navigation.addListener('willBlur',
      () => this.componentWillBlur());
  }

  componentDidFocus() {
    this.initData({ supermarketId: this.props.selectedMarket });
  }

  componentWillBlur() {
    this.dateFilter = moment(new Date()).format('YYYY-MM-DD');
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading && !!this.state.inSideLoading) {
      this.setState({ inSideLoading: false });
    }

    if (this.props.selectedMarket !== nextProps.selectedMarket) {
      this.initData({ supermarketId: nextProps.selectedMarket });
    }
  }

  initData(params) {
    params = this.generateParams(params);
    ReportFactory.getReport(params);
  }

  onRefresh = () => {
    if (this.keyword.length > 0) {
      return;
    }

    const params = this.generateParams();
    ReportFactory.getNewReport(params);
  };

  onEndReached = () => {
    if (this.keyword.length > 0) {
      return;
    }

    this.pageSize = this.pageSize + QueryParam.pageSize;
    const params = this.generateParams({ pageSize: this.pageSize });
    ReportFactory.getOldReport(params);
  };

  onSelectDate = (date) => {
    this.dateFilter = moment(date).format('MM-DD-YYYY');
    this.initData({});
  };

  onSearch = async (textSearch) => {
    try {
      this.keyword = textSearch;
      const data = await ReportFactory.fetchReport({
        textSearch,
        supermarketId: this.props.selectedMarket,
        date: this.dateFilter,
      }).then(response => response.purchaseList).catch(error => {
        throw error;
      });
      if (this.reportList) {
        const reportList = this.reportList.getWrappedInstance();
        reportList.onSearch(data);
      }
    } catch (e) {
      this.props.fetchFailure(e);
      if (__DEV__) {
        console.log('[ERROR] onSearch', e);
      }
    }
  };

  onClose = () => {
    this.keyword = '';
    if (this.reportList) {
      const reportList = this.reportList.getWrappedInstance();
      reportList.onClose();
    }
  };

  renderHeader() {
    const { layoutCenter, filterText } = styles;

    return (
      <LayoutHeader>
        <View
          style={[layoutCenter, { justifyContent: 'space-between', flex: 1 }]}>
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
          <SearchButton onClose={this.onClose} onSearch={this.onSearch}/>
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
            {!isLoading && !inSideLoading && error === null &&
            <ReportList
              ref={ref => this.reportList = ref}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
            />
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
    backgroundColor: Colors.buttonSecondary,
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
    isLoading: state.report.get('isLoading'),
    error: state.report.get('error'),
    selectedMarket: state.app.get('selectedMarket'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchFailure: fromReport.actions.fetchFailure,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportScene);