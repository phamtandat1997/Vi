import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import I18n from 'react-native-i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import Strings from '../../components/I18n/Strings';
import MyText from '../../components/myText/MyText';
import { HeaderNavStyles } from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import AuthenticationFactory from '../../factories/AuthenticationFactory';
import BackHandlerProvider, { TYPE_NAVIGATION } from '../../components/backProvide';
import Layout from '../../constants/Layout';
import LoginForm from '../../components/form/login';
import ProductFactory from '../../factories/ProductFactory';

class LoginScene extends Component {

  static navigationOptions = {
    ...HeaderNavStyles.NavBar,
    header: null,
  };

  constructor(props) {
    super(props);
    this.postSubmit = null;
    this.clearForm = null;
  }

  componentDidMount() {
    AuthenticationFactory.reset();
    ProductFactory.clearIntervalFetchPurchases();

    this.props.navigation.addListener('didFocus',
      () => this.componentDidFocus());
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading && this.postSubmit !== null) {
      this.postSubmit();
    }

    if (!!nextProps.isAuth && !nextProps.isLoading && this.clearForm !== null) {
      this.clearForm();
    }
  }

  componentDidFocus() {
    StatusBar.setBackgroundColor(Colors.blackOrigin, false);
    StatusBar.setTranslucent(false);
  }

  shouldComponentUpdate(nextProps) {
    const isDifferentLoading = nextProps.isLoading !== this.props.isLoading;
    const isDifferentAuth = nextProps.isAuth !== this.props.isAuth;

    return isDifferentLoading || isDifferentAuth;
  }

  doLogin = (values, postSubmit, clearForm) => {
    AuthenticationFactory.login(values);
    this.postSubmit = postSubmit;
    this.clearForm = clearForm;
  };

  render() {
    const { imageWrapper, container, wrapper, textStyle } = styles;
    return (
      <BackHandlerProvider type={TYPE_NAVIGATION.ROOT}>
        <KeyboardAwareScrollView style={container}>
          <ImageBackground
            resizeMode={'stretch'}
            source={Images.BACKGROUND_LOGIN}
            style={imageWrapper}>
            <View style={wrapper}>
              <MyText style={textStyle}>
                {I18n.t(Strings.SALE_MANAGEMENT)}
              </MyText>
              <LoginForm onSubmit={this.doLogin}/>
            </View>

          </ImageBackground>
        </KeyboardAwareScrollView>
      </BackHandlerProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryConstraint,
  },
  imageWrapper: {
    height: Layout.window.height,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  wrapper: {
    marginLeft: '25%',
    width: '60%',
    marginTop: 60,
  },
  textStyle: {
    fontSize: 22,
    color: Colors.yellow,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
});

const mapStateToProps = state => {
  return {
    isLoading: state.auth.get('isLoading'),
    isAuth: state.auth.get('isAuth'),
  };
};

export default connect(mapStateToProps, null)(LoginScene);
