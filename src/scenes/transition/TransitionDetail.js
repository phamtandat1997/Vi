import React, { Component } from 'react';
import {
  FlatList,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import Strings from '../../components/I18n/Strings';
import { HeaderNavStyles } from '../../constants/Styles';
import TransitionFactory from '../../factories/TransitionFactory';
import WaitingView from '../../components/waitingView/WaitingView';
import TransitionItem from '../../components/transition/TransitionItem';
import Colors from '../../constants/Colors';
import MyText from '../../components/myText/MyText';
import TransitionItemLayout
  from '../../components/transition/TransitionItemLayout';
import InfoItemLayout from '../../components/infomation/InfoItemLayout';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';

class TransitionDetailScene extends Component {

  static navigationOptions = () => {
    return {
      ...HeaderNavStyles.NavBar,
      headerTitle: I18n.t(Strings.DETAIL_INFO),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      inSideLoading: true,
    };
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      TransitionFactory.getTransitionDetail(this.props.id);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading && !!this.state.inSideLoading) {
      this.setState({ inSideLoading: false });
    }
  }

  onAccept = async () => {
    await TransitionFactory.acceptTransfer(this.props.detail);
  };

  renderHeader = () => {
    const { headerTextStyle } = styles;
    const title = this.props.isInput ?
      I18n.t(Strings.SENT_SUPERMARKET) :
      I18n.t(Strings.RECEIVED_SUPERMARKET);

    return (
      <TransitionItemLayout
        containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#fff' }}
        col1={<MyText style={headerTextStyle}>{title}</MyText>}
        col2={<MyText style={headerTextStyle}>{I18n.t(
          Strings.SENT_DATE)}</MyText>}
        col3={<MyText style={headerTextStyle}>{I18n.t(
          Strings.RECEIVED_DATE)}</MyText>}
        col4={<MyText style={headerTextStyle}>{I18n.t(Strings.STATUS)}</MyText>}
      />
    );
  };

  renderContent() {
    const { detail, isInput } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <TransitionItem
          isDetail={true}
          isInput={isInput}
          item={detail}
          onAccept={this.onAccept}
        />
        {this.renderProducts()}
      </View>
    );
  }

  renderItemHeader = () => {
    const { headerTextStyle } = styles;

    return (
      <InfoItemLayout
        containerStyle={{ paddingHorizontal: 15 }}
        col1={<MyText style={headerTextStyle}>{I18n.t(
          Strings.PRODUCT)}</MyText>}
        col2={<MyText style={headerTextStyle}>{I18n.t(Strings.WEIGHT)}</MyText>}
      />
    );
  };

  renderProducts() {
    const { items } = this.props.detail;

    if (items.length === 0) {
      return null;
    }
    return (
      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        {this.renderItemHeader()}
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 1, flexShrink: 1 }}
          removeClippedSubviews={true}
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => this.renderProduct(item)}
        />
      </View>
    );
  }

  renderProduct({ item }) {
    const { productName, weight } = item;
    const { productNameText, weightText } = styles;

    return (
      <InfoItemLayout
        containerStyle={{ paddingHorizontal: 15 }}
        col1={<MyText style={productNameText}>{productName}</MyText>}
        col2={<MyText style={weightText}>{weight} kg</MyText>}
      />
    );
  }

  render() {
    const { container } = styles;
    const { inSideLoading } = this.state;
    const { isLoading } = this.props;

    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.CHILD}>
        <View style={container}>
          {(inSideLoading || isLoading) && <WaitingView/>}
          {!inSideLoading && !isLoading && this.renderContent()}
        </View>
      </BackHandlerProvider>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.primaryConstraint,
    justifyContent: 'space-between',
  },
  productNameText: {
    fontSize: 20,
    color: Colors.blackPrimary,
    flexGrow: 1,
    flexShrink: 1,
  },
  weightText: {
    fontSize: 20,
    color: Colors.blackPrimary,
    width: 140,
  },
  headerTextStyle: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.blackContrast,
  },
};

const mapStateToProps = (state, ownProps) => {
  const { id, isInput } = ownProps.navigation.state.params;
  const entities = state.transition.get('entities');

  return {
    isLoading: state.transition.get('isLoading'),
    isInput,
    id,
    detail: entities[id],
  };
};

export default connect(mapStateToProps, null)(TransitionDetailScene);