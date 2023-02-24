import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import InfoItem from './InfoItem';
import NoDataView from '../noDataView/NoDataView';
import MyText from '../myText/MyText';
import InfoItemLayout from './InfoItemLayout';
import I18n from "react-native-i18n";
import Strings from "../I18n/Strings";

class InfoList extends React.Component {

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

  renderItems({ item }) {
    return <InfoItem item={item}/>;
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
      <InfoItemLayout
        col1={<MyText style={headerTextStyle}>{I18n.t(Strings.PRODUCT)}</MyText>}
        col2={<MyText style={headerTextStyle}>{I18n.t(Strings.WEIGHT)}</MyText>}
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
          data={data}
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
    entities: state.info.get('entities'),
    isGettingOldData: state.info.get('isGettingOldData'),
    hasMoreData: state.info.get('hasMoreData'),
    refreshing: state.info.get('refreshing'),
  };
};

export default connect(mapStateToProps, null)(InfoList);