import React from 'react';
import {
  View,
  Image,
  ImageBackground,
} from 'react-native';
import I18n from 'react-native-i18n';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import fromAuth from '../../store/auth';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';

import MyText from '../../components/myText/MyText';
import Strings from '../I18n/Strings';

class UserInfo extends React.PureComponent {

  constructor() {
    super();
  }

  renderUserAvatar() {
    const user = this.props.currentUser;
    const avatar = this.props.currentUser.avatarUrl ?
      { uri: user.avatarUrl } : Images.NO_AVATAR;
    return <Image style={styles.avatarStyle} source={avatar}/>;
  }

  renderUserInfo() {
    const user = this.props.currentUser;
    const { userNameText } = styles;
    const userName = (user.fullName || user.username);
    const textDisplay = userName ? userName : I18n.t(Strings.EMPLOYEE);
    const email = user.email ? user.email : '';

    return (
      <View style={{ marginLeft: 10 }}>
        <MyText numberOfLines={1} style={userNameText}>{textDisplay}</MyText>
        <MyText
          numberOfLines={1}
          style={{ color: Colors.primaryConstraint, width: 200 }}>
          {email}
        </MyText>
      </View>
    );
  }

  render() {
    const { container } = styles;

    if (this.props.currentUser === null) {
      return null;
    }

    return (
      <ImageBackground
        source={Images.HEADER_SIDEBAR}
        style={container}
      >
        {this.renderUserAvatar()}
        {this.renderUserInfo()}
      </ImageBackground>

    );
  }
}

const styles = {
  container: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: Colors.primary,
  },
  avatarStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  userNameText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.yellow,
  },
};

const mapStateToProps = state => {
  return {
    currentUser: state.auth.get('currentUser'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    setIsAuth: fromAuth.actions.setIsAuth,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
