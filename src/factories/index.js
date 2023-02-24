import Authentication from './AuthenticationFactory';
import SaleFactory from "./SaleFactory";
import ReturnFactory from "./ReturnFactory";
import MarketFactory from "./MarketFactory";

const factories = [
  Authentication,
  SaleFactory,
  ReturnFactory,
  MarketFactory
];

export default {
  run() {
    // factories.forEach((factory) => {
    //   factory.run();
    // });
  },

  async logOut() {
    for (let i = 0; i < factories.length; i++) {
      const factory = factories[i];
      if (factory.onLogout) {
        await factory.onLogout();
      }
    }
  }
};
