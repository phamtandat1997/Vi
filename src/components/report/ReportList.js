import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';
import NoDataView from '../noDataView/NoDataView';
import ReportItem from './ReportItem';
import ReportItemLayout from './ReportItemLayout';
import Strings from '../I18n/Strings';

class ReportList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: Object.values(props.entities),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.entities !== nextProps.entities ||
      this.props.refreshing !== nextProps.refreshing ||
      this.props.hasMoreData !== nextProps.hasMoreData ||
      this.props.isGettingOldData !== nextProps.isGettingOldData ||
      this.state.data !== nextState.data;
  }

  onEndReached = () => {
    if (this.scrollBegin && !!this.props.hasMoreData) {
      this.scrollBegin = false;
      this.props.onEndReached && this.props.onEndReached();
    }
  };

  onRefresh = () => {
    this.props.onRefresh && this.props.onRefresh();
  };

  onSearch(data) {
    this.setState({ data });
  }

  onClose() {
    this.setState({ data: Object.values(this.props.entities) });
  }

  renderItems({ item }) {
    return <ReportItem item={item}/>;
  }

  renderFooter = () => {
    if (!this.props.isGettingOldData) {
      return null;
    }
    return (
      <View style={{ paddingVertical: 10 }}>
        <ActivityIndicator
          animating
          size={30}
          color={Colors.primary}
        />
      </View>
    );
  };

  renderHeader = () => {
    const { headerTextStyle } = styles;

    return (
      <ReportItemLayout
        col1={<MyText style={headerTextStyle}>{I18n.t(Strings.TIME)}</MyText>}
        col2={<MyText style={headerTextStyle}>{I18n.t(
          Strings.PRODUCT)}</MyText>}
        col3={<MyText style={headerTextStyle}>{I18n.t(Strings.TYPE)}</MyText>}
        col4={<MyText style={headerTextStyle}>{I18n.t(Strings.WEIGHT)}</MyText>}
      />
    );
  };

  render() {
    const { refreshing } = this.props;
    let data = this.state.data;

    if (data.length === 0) {
      return (
        <NoDataView>
          <MyText style={{ fontSize: 20 }}>{I18n.t(Strings.NO_DATA)}</MyText>
        </NoDataView>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.container}
          removeClippedSubviews={true}
          data={data.reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => this.renderItems(item)}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => this.scrollBegin = true}
          ListFooterComponent={this.renderFooter()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              colors={[Colors.primary]}
            />
          }
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
  headerTextStyle: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.blackContrast,
  },
};

const mapStateToProps = state => {
  return {
    entities: state.report.get('entities'),
    isGettingOldData: state.report.get('isGettingOldData'),
    hasMoreData: state.report.get('hasMoreData'),
    refreshing: state.report.get('refreshing'),
  };
};

export default connect(mapStateToProps, null, null, { withRef: true })(
  ReportList);