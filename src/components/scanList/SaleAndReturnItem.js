import React from 'react';
import { ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';

import Colors from '../../constants/Colors';
import MyText from '../myText/MyText';
import ItemLayout from './ItemLayout';
import { Translate } from '../I18n';

export default class SaleAndReturnItem extends React.Component {

  constructor() {
    super();

    this.state = {
      color: Colors.primaryConstraint,
    };
  }

  componentDidMount() {
    this.toggleColor();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.color !== nextState.color ||
      this.props.item !== nextProps.item;
  }

  toggleColor() {
    setTimeout(() => {
      this.setState({ color: Colors.buttonPrimary });
    }, 1000);

    setTimeout(() => {
      this.setState({ color: Colors.primaryConstraint });
    }, 5000);
  }

  onPress = () => {
    this.props.onPress && this.props.onPress(this.props.item);
  };

  render() {
    const { item, index } = this.props;
    return (
      <ListItem
        onPress={this.onPress}
        key={index}
        title={(
          <ItemLayout
            isHeader={false}
            col1={item.date}
            col2={item.barcode}
            col3={item.name}
            col4={item.weight + ' (Kg)'}
            col5={item.loading ? (<ActivityIndicator/>) : (<MyText
              style={[
                styles.statusStyle,
                {
                  backgroundColor: item.status ?
                    Colors.green :
                    Colors.orange,
                }]}>
              {item.status ? Translate('SOLD') : Translate('RETURNED')}
            </MyText>)}
          />
        )}
        containerStyle={{
          paddingVertical: 8,
          backgroundColor: this.state.color,
        }}
        disabled={item.loading}
        bottomDivider
      />
    );
  };
}

const styles = {
  statusStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
};