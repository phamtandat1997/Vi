import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';
import TransitionItem from './TransitionItem';
import NoDataView from '../noDataView/NoDataView';
import TransitionItemLayout from './TransitionItemLayout';
import I18n from "react-native-i18n";
import Strings from "../I18n/Strings";

class TransitionList extends React.Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.entities !== nextProps.entities ||
      this.props.refreshing !== nextProps.refreshing ||
      this.props.hasMoreData !== nextProps.hasMoreData ||
      this.props.isGettingOldData !== nextProps.isGettingOldData;
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

  navigateDetailProduct = (item) => {
    this.props.navigateDetail(item);
  };

  renderItems({ item }) {
    return (
      <TransitionItem
        isInput={this.props.isInput}
        item={item}
        onPress={() => this.navigateDetailProduct(item)}
        isDetail={false}
      />
    );
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
    const title = this.props.isInput ? I18n.t(Strings.SENT_SUPERMARKET) : I18n.t(Strings.RECEIVED_SUPERMARKET);

    return (
      <TransitionItemLayout
        col1={<MyText style={headerTextStyle}>{title}</MyText>}
        col2={<MyText style={headerTextStyle}>{I18n.t(Strings.SENT_DATE)}</MyText>}
        col3={<MyText style={headerTextStyle}>{I18n.t(Strings.RECEIVED_DATE)}</MyText>}
        col4={<MyText style={headerTextStyle}>{I18n.t(Strings.STATUS)}</MyText>}
      />
    );
  };

  render() {
    const { refreshing, entities } = this.props;
    const data = Object.values(entities);

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
    entities: state.transition.get('entities'),
    isGettingOldData: state.transition.get('isGettingOldData'),
    hasMoreData: state.transition.get('hasMoreData'),
    refreshing: state.transition.get('refreshing'),
  };
};

export default connect(mapStateToProps, null)(TransitionList);