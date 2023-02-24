export const actions = {
  APPEND_SALE_BARCODE: '@CUSTOMER/APPEND_SALE_BARCODE',
  REMOVE_SALE_BARCODE: '@CUSTOMER/REMOVE_SALE_BARCODE',
  TOGGLE_SALE_BARCODE: '@CUSTOMER/TOGGLE_SALE_BARCODE',
  CLEAR_SALE_BARCODE: '@CUSTOMER/CLEAR_SALE_BARCODE',
  APPEND_RETURN_BARCODE: '@CUSTOMER/APPEND_RETURN_BARCODE',
  REMOVE_RETURN_BARCODE: '@CUSTOMER/REMOVE_RETURN_BARCODE',
  TOGGLE_RETURN_BARCODE: '@CUSTOMER/TOGGLE_RETURN_BARCODE',
  CLEAR_RETURN_BARCODE: '@CUSTOMER/CLEAR_RETURN_BARCODE',

  appendSaleBarcode: (data) => {
    return {
      type: actions.APPEND_SALE_BARCODE,
      data,
    };
  },
  removeSaleBarcode: (id) => {
    return {
      type: actions.REMOVE_SALE_BARCODE,
      id,
    };
  },
  toggleSaleBarcode: (id) => {
    return {
      type: actions.TOGGLE_SALE_BARCODE,
      id,
    };
  },
  clearSaleBarcode: () => {
    return {
      type: actions.CLEAR_SALE_BARCODE,
    };
  },

  appendReturnBarcode: (data) => {
    return {
      type: actions.APPEND_RETURN_BARCODE,
      data,
    };
  },
  removeReturnBarcode: (id) => {
    return {
      type: actions.REMOVE_RETURN_BARCODE,
      id,
    };
  },
  toggleReturnBarcode: (id) => {
    return {
      type: actions.TOGGLE_RETURN_BARCODE,
      id,
    };
  },
  clearReturnBarcode: () => {
    return {
      type: actions.CLEAR_RETURN_BARCODE,
    };
  },

};