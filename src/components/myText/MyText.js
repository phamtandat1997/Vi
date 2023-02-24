import React from 'react';
import { Text } from 'react-native';
import { fontMaker } from '../../utils/Fonts';

export default class MyText extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let fontFamily = fontMaker({
      weight: this.props.weight || null,
    });
    return (
      <Text{...this.props} style={[fontFamily, this.props.style]}>
        {this.props.children}
      </Text>
    );
  }
}