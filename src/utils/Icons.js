import Icon from 'react-native-vector-icons/MaterialIcons';

export default class IconUtil {
  static home = '';

  static async init(){
    await Promise.all(
      [
        //Icon.getImageSource('home', 20, '#CF2020'),
        //Icon.getImageSource('home', 20, '#3370C4'),
        //Icon.getImageSource('home', 20, '#00b5d5'),
        //Icon.getImageSource('person-pin-circle', 30, '#130cf8'),
      ]
    ).then((values) => {
      //this.currentProperty = values[0];
      //this.nearbyProperty = values[1];
      //this.awaitingSecondIcon = values[2];
      //this.userLocationIcon = values[3];
    }).catch((error) => {
      console.log(error);
    }).done();
  }
}