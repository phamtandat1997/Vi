import Strings from '../components/I18n/Strings';
import Images from './Images';

export default [
  {
    roles: ['NhanVienQuay', 'NhanVienQuanLy'],
    name: Strings.INFORMATION,
    title: Strings.INPUT_INFORMATION,
    icon: Images.INFO,
    shadow: Images.INFO_SHADOW,
    link: 'InputInfo',
    child: [
      {
        name: Strings.INPUT_INFORMATION,
        title: Strings.INPUT_INFORMATION,
        link: 'InputInfo',
        icon: 'redo',
      },
      {
        name: Strings.RETURN_INFORMATION,
        title: Strings.RETURN_INFORMATION,
        link: 'ReturnInfo',
        icon: 'undo',
      },
      {
        name: Strings.INVENTORY,
        title: Strings.INVENTORY,
        link: 'Inventories',
        icon: 'undo',
      },
    ],
  },
  {
    roles: ['NhanVienQuay', 'NhanVienQuanLy'],
    name: Strings.CUSTOMER,
    title: Strings.SALE_MANAGEMENT,
    icon: Images.CUSTOMER,
    shadow: Images.CUSTOMER_SHADOW,
    link: 'CustomerSale',
    child: [
      {
        name: Strings.SELL,
        title: Strings.SALE_MANAGEMENT,
        link: 'CustomerSale',
        icon: 'people',
      },
      {
        name: Strings.RETURN,
        title: Strings.RETURN_MANAGEMENT,
        link: 'CustomerReturn',
        icon: 'people',
      },
    ],
  },
  {
    roles: ['NhanVienQuay', 'NhanVienQuanLy'],
    name: Strings.PACKAGING,
    title: Strings.PACKAGING_SELL,
    icon: Images.PACKAGING,
    shadow: Images.PACKAGING_SHADOW,
    link: 'PackageSale',
    child: [
      {
        name: Strings.PACKAGING_SELL,
        title: Strings.PACKAGING_SELL,
        link: 'PackageSale',
        icon: {
          name: 'barcode-scan',
          type: 'material-community',
        },
      },
      {
        name: Strings.PACKAGING_RETURN,
        title: Strings.PACKAGING_RETURN,
        link: 'PackageReturn',
        icon: {
          name: 'barcode-scan',
          type: 'material-community',
        },
      },
    ],
  },
  {
    roles: ['NhanVienQuay', 'NhanVienQuanLy'],
    name: Strings.KITCHEN,
    title: Strings.KITCHEN_SELL,
    icon: Images.KITCHEN,
    shadow: Images.KITCHEN_SHADOW,
    link: 'KitchenSale',
    child: [
      {
        name: Strings.KITCHEN_SELL,
        title: Strings.KITCHEN_SELL,
        link: 'KitchenSale',
        icon: 'local-dining',
      },
      {
        name: Strings.KITCHEN_RETURN,
        title: Strings.KITCHEN_RETURN,
        link: 'KitchenReturn',
        icon: 'local-dining',
      },
    ],
  },
  {
    roles: ['NhanVienQuay', 'NhanVienQuanLy'],
    name: Strings.TRANSITION,
    title: Strings.OUTPUT_TRANSITION,
    link: 'SendTransition',
    shadow: Images.TRANSITION_SHADOW,
    icon: Images.TRANSITION,
    child: [
      {
        name: Strings.OUTPUT_TRANSITION,
        title: Strings.OUTPUT_TRANSITION,
        link: 'SendTransition',
        icon: {
          name: 'truck-fast',
          type: 'material-community',
        },
      },
      {
        name: Strings.INPUT_TRANSITION,
        title: Strings.INPUT_TRANSITION,
        link: 'ReceivedTransition',
        icon: {
          name: 'truck-fast',
          type: 'material-community',
        },
      },
    ],
  },
  {
    roles: ['NhanVienQuay', 'NhanVienQuanLy'],
    name: Strings.REPORT_TODAY,
    title: Strings.REPORT_TODAY,
    shadow: Images.REPORT_SHADOW,
    link: 'ReportToday',
    icon: Images.REPORT,
  },
];
