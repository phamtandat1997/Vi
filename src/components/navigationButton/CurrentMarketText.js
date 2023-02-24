import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';

class CurrentMarketText extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  getStyle(name) {
    return this.props.style ? this.props.style[name] : {};
  }

  render() {
    const { container, textStyle } = styles;
    const { marketList, selectedMarket } = this.props;
    const market = marketList.find(market => market.id === selectedMarket);

    if (market) {
      return (
        <View style={[container, this.getStyle('container')]}>
          <MyText style={[textStyle, this.getStyle('textStyle')]}>
            {market.name}
          </MyText>
        </View>
      );
    }
    return null;
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -10,
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

export default connect(mapStateToProps, null)(CurrentMarketText);