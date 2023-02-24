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
import NoDataView from '../noDataView/NoDataView';
import InventoryItem from './InventoryItem';
import InventoryItemLayout from './InventoryItemLayout';
import { Translate } from '../I18n';

class InventoryList extends React.Component {

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
    return <InventoryItem item={item}/>;
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
      <InventoryItemLayout
        col1={<MyText style={headerTextStyle}>{Translate('PRODUCT')}</MyText>}
        col2={<MyText style={headerTextStyle}>{Translate('WEIGHT')}</MyText>}
      />
    );
  };

  render() {
    const { refreshing, entities } = this.props;
    let data = Object.values(entities);

    if (data.length === 0) {
      return (
        <NoDataView>
          <MyText style={{ fontSize: 20 }}>{Translate('NO_DATA')}</MyText>
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
    entities: state.inventory.get('entities'),
    isGettingOldData: state.inventory.get('isGettingOldData'),
    hasMoreData: state.inventory.get('hasMoreData'),
    refreshing: state.inventory.get('refreshing'),
  };
};

export default connect(mapStateToProps, null)(InventoryList);