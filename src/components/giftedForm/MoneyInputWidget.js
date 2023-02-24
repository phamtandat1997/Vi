// import NumberFormat from 'react-number-format';
// import React from 'react';
// import {
//   Keyboard,
//   View,
// } from 'react-native';
// import { Input } from 'react-native-elements';
// import { GiftedFormManager } from '@nois/react-native-gifted-form';
//
// import Colors from '../../constants/Colors';
// import Layout from '../../constants/Layout';
// import CommonService from '../../utils/CommonService';
// import MyText from '../myText/MyText';
//
// export default class MoneyInputWidget extends React.Component {
//
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       value: props.value || null,
//     };
//   }
//
//   componentDidMount() {
//     this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
//       () => {
//         if (this.inputRef) {
//           this.inputRef.blur();
//         }
//       });
//     this.updateFormValue(this.props.value);
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (this.props.value !== nextProps.value) {
//       this.setState({ value: nextProps.value }, () => {
//         this.updateFormValue(nextProps.value);
//       });
//     }
//   }
//
//   // shouldComponentUpdate(nextProps, nextState) {
//   //   return nextProps.errors !== this.props.errors ||
//   //       nextProps.touched !== this.props.touched ||
//   //       nextProps.value !== this.props.value;
//   // }
//
//   componentWillUnmount() {
//     this.keyboardDidHideListener.remove();
//   }
//
//   getPropStyle() {
//     const { container, inputContainer, errorStyle } = styles;
//     const { errors, placeholderColor, touched } = this.props;
//
//     return {
//       containerStyle: [
//         container,
//         this.getStyle('rowContainer'),
//         (touched && errors !== null) ? { borderBottomWidth: 0 } : {},
//       ],
//       inputContainerStyle: [
//         inputContainer,
//         this.getStyle('inputContainer'),
//         (touched && errors !== null) ? errorStyle : {},
//       ],
//       inputStyle: [
//         { color: Colors.textDark, fontSize: 16 },
//         this.getStyle('inputStyle'),
//       ],
//       placeholderTextColor: placeholderColor ?
//         placeholderColor : Colors.greySecondary,
//       selectionColor: Colors.primary,
//       labelStyle: { marginBottom: 5 },
//     };
//   }
//
//   getStyle(name) {
//     return this.props.widgetStyles ? this.props.widgetStyles[name] : undefined;
//   }
//
//   onChangeText = (text) => {
//     const rawValue = text.replace(/,/g, '');
//     if (rawValue.trim().length < 16) {
//       const price = CommonService.getPrice(text);
//
//       this.updateFormValue(price);
//       this.setState({ value: text }, () => {
//         if (this.props.onChangeText) {
//           this.props.onChangeText(price);
//         }
//       });
//     }
//   };
//
//   updateFormValue(value) {
//     const { formName, name } = this.props;
//     GiftedFormManager.updateValue(formName, name, value);
//   }
//
//   render() {
//     const { placeholder, disable, errors, readOnly } = this.props;
//     const { value } = this.state;
//     const propStyles = this.getPropStyle();
//     const { showWordText } = styles;
//
//     return (
//       <NumberFormat
//         thousandSeparator={true}
//         decimalSeparator={'.'}
//         value={value}
//         displayType={'text'}
//         renderText={value => (
//           <View>
//             <Input
//               ref={ref => this.inputRef = ref}
//               {...this.props}
//               {...propStyles}
//               keyboardType='numeric'
//               errorMessage={errors}
//               placeholder={placeholder}
//               value={value}
//               onChangeText={(text) => this.onChangeText(text)}
//             />
//             {this.props.showWord &&
//             CommonService.convertToWord(value) !== '' &&
//             <MyText style={showWordText}>
//               {CommonService.convertToWord(value)} {this.props.unit}
//             </MyText>}
//           </View>
//         )}
//       />
//     );
//   }
// }
//
// const styles = {
//   container: {
//     width: Layout.window.width > 420 ? 420 : 200,
//     marginBottom: 30,
//   },
//   inputContainer: {
//     backgroundColor: Colors.primaryConstraint,
//     borderBottomWidth: 0,
//     paddingVertical: 3,
//     paddingTop: 6,
//     marginLeft: 10,
//   },
//   errorStyle: {
//     borderColor: Colors.danger,
//     borderWidth: 2,
//     borderBottomWidth: 2,
//   },
//   showWordText: {
//     width: 250,
//     marginLeft: 10,
//     marginTop: 5,
//     fontSize: 16,
//     color: Colors.blackPrimary,
//   },
// };