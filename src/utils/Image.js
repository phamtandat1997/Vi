import {
  Platform,
  Image
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';

import Config from '../constants/Config';

export default {
  async upload (imageUri) {
    let photo = {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${new Date().getTime().toString()}.jpg`
    };

    let body = new FormData();
    body.append('file', photo);

    let response = await fetch(`${Config.API_URL}/m-api/Files/uploadImage`, {
      method: 'POST',
      body: body
    });

    let result = await response.json();

    // console.log('image upload response', JSON.stringify(response));
    // console.log('image upload result', JSON.stringify(result));

    if (response.status !== 200) {
      throw new Error("Failed to upload image");
    }

    return result;
  },
  async resizeImage (imageUri, width, height) {
    return new Promise((resolve, reject) => {
        ImageResizer.createResizedImage(imageUri, width || 1000, height || 1000, 'JPEG', 90)
          .then((res) => {
            resolve('file://' + res);
          }, (err) => {
            reject(err);
          });
    });
  },

  async getAutoHeightImage (imageUri, toWidth) {
    return new Promise((resolve, reject) => {
      Image.getSize(imageUri, (width, height) => {
        // success
        resolve({ width: toWidth, height: toWidth * height / width });
      }, reject);
    });
  }
}