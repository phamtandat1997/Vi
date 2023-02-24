import React, { PureComponent } from 'react';
import { View } from 'react-native';

import Colors from '../../constants/Colors';

export class LayoutHeader extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const { layoutCenter, headerContainer } = styles;

    return (
        <View style={[layoutCenter, headerContainer, this.props.style]}>
          {this.props.children}
        </View>
    );
  }

}

const styles = {
  layoutCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: Colors.primaryConstraint,
    paddingVertical: 5,
    borderBottomColor: Colors.greyBorder,
    borderBottomWidth: 1,
    elevation: 1,
    marginBottom: 2,
  },
};
