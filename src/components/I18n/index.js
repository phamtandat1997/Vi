import React from 'react';
import I18n from 'react-native-i18n';
import Strings from './Strings';
import en from './en';
import vi from './vi';

export default class LanguagesProvider extends React.Component {
  constructor(props) {
    super(props);

    // Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
    I18n.fallbacks = true;

    I18n.translations = {
      en: en,
      vi: vi,
    };
  }

  render() {
    return null;
  }
}

export const Translate = (key) => {
  return I18n.t(Strings[key]);
};