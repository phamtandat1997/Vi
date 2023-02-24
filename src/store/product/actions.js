export const actions = {
  GET_PRODUCTS: '@PRODUCT/GET_PRODUCTS',
  GET_PRODUCTS_SUCCESS: '@PRODUCT/GET_PRODUCTS_SUCCESS',
  FETCH_FAILURE: '@PRODUCT/FETCH_FAILURE',

  getProducts: () => {
    return {
      type: actions.GET_PRODUCTS,
    };
  },

  fetchFailure: (error) => {
    return {
      type: actions.FETCH_FAILURE,
      payload: { error },
    };
  },

};