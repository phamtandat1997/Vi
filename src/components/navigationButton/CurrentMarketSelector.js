import React from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import MarketFactory from '../../factories/MarketFactory';
import MarketSelector from '../../components/marketSelector';

class CurrentMarketSelector extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  getStyle(name) {
    return this.props.style ? this.props.style[name] : {};
  }

  onSelect = (marketId) => {
    if (this.props.onSelect) {
      this.props.onSelect(marketId);
    } else {
      MarketFactory.setMarket(marketId);
    }
  };

  toggleModal = () => {
    this.makerSelector.onPress();
  };

  render() {
    const { container } = styles;
    const { marketList, selectedMarket } = this.props;
    const market = marketList.find(market => market.id === selectedMarket);
    const selectorStyle = this.getStyle('selector');

    if (market) {
      return (
        <TouchableOpacity
          onPress={this.toggleModal}
          style={[container, this.getStyle('container')]}>
          <MarketSelector
            data={marketList}
            value={selectedMarket}
            ref={ref => this.makerSelector = ref}
            name={'marketSelector'}
            widgetStyles={this.getStyle('selectWidgetStyles')}
            placeholderColor={selectorStyle.placeholderColor || '#9B9B9B'}
            formName={'marketSelector'}
            textColor={selectorStyle.textColor || Colors.yellow}
            onSelect={(value) => this.onSelect(value)}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 16,
    color: Colors.yellow,
    marginLeft: 5,
  },
};

const mapStateToProps = state => {
  return {
    marketList: state.app.get('marketList'),
    selectedMarket: state.app.get('selectedMarket'),
  };
};

export const CurrentMarketSelectorButton = connect(mapStateToProps, null)(
  CurrentMarketSelector);