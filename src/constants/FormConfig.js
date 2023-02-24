import Strings from '../components/I18n/Strings';

const productForm = {
  fields: {
    id: 'id',
    weight: 'weight',
  },
  validators: {
    weight: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Hãy nhập trọng lượng',
        },
        {
          validator: (value) => {

            // return /^\d*\.?|,?\d+$/.test(value);
            return /^[0-9.,]+$/.test(value);
          },
          message: 'Trọng lượng không hợp lệ',
        },
        {
          validator: (value) => {
            if (value && value.search(',') > 0) {
              value = value.replace(/,/g, '.');
            }
            value = parseFloat(value);
            return value > 0;
          },
          message: 'Trọng lượng phải lớn 0',
        },
      ],
    },
    id: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Chọn sản phẩm',
        },
      ],
    },
  },
};

const transitionForm = {
  fields: {
    sendMarketId: 'sendMarketId',
    receiveMarketId: 'receiveMarketId',
    items: 'items',
  },
  validators: {
    receiveMarketId: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Hãy chọn siêu thị nhập',
        },
      ],
    },
  },
};

const configForm = {
  fields: {
    timeSync: 'timeSync',
    batteryPercent: 'batteryPercent',
    scheduleSendBatteryInfo: 'scheduleSendBatteryInfo',
  },
  validators: {
    timeSync: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Vui lòng nhập thời gian đồng bộ',
        },
      ],
    },
    batteryPercent: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Vui lòng nhập dung lượng pin để gửi lên Server',
        },
      ],
    },
    scheduleSendBatteryInfo: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Vui lòng nhập các khoảng khung giờ để gửi lên Server',
        },
      ],
    },
  },
};

export const FormConfig = {
  productForm,
  transitionForm,
  configForm,
};
export const VALIDATORS = {
  configForm: {
    timeSync: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: Strings.ERROR_USERNAME_REQUIRED,
        },
      ],
    },
    batteryPercent: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: Strings.ERROR_USERNAME_REQUIRED,
        },
      ],
    },
    scheduleSendBatteryInfo: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: Strings.ERROR_USERNAME_REQUIRED,
        },
      ],
    },
  },
  loginForm: {
    username: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: Strings.ERROR_USERNAME_REQUIRED,
        },
      ],
    },
    password: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: Strings.ERROR_PASSWORD_REQUIRED,
        }],
    },
  },
  transitionForm: {
    productType: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Hãy nhập loại thịt',
        },
      ],
    },
    weight: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Hãy nhập trọng lượng',
        },
      ],
    },
    receiverSuperMarker: {
      validate: [
        {
          validator: 'isLength',
          arguments: [1],
          message: 'Hãy chọn siêu thị nhập',
        },
      ],
    },
  },
};
