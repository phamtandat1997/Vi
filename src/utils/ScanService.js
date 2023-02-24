// import DataWedgeIntents from 'react-native-datawedge-intents';
// import HandheldReader from "react-native-handheld-reader";
import { DeviceEventEmitter } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default class ScanService {
  // from Datawedge API
  static ACTION_SOFTSCANTRIGGER = 'com.symbol.datawedge.api.SOFT_SCAN_TRIGGER';
  static ACTION_SCANNERINPUTPLUGIN = 'com.symbol.datawedge.api.SCANNER_INPUT_PLUGIN';
  static START_SCANNING = 'START_SCANNING';
  static STOP_SCANNING = 'STOP_SCANNING';
  static TOGGLE_SCANNING = 'TOGGLE_SCANNING';
  static ENABLE_PLUGIN = 'ENABLE_PLUGIN';
  static DISABLE_PLUGIN = 'DISABLE_PLUGIN';
  // custom
  static PACKAGE_NAME = DeviceInfo.getBundleId();
  static PROFILE_NAME = 'NOIS_VSM';
  static ACTION_NAME = 'com.zebra.reactnative.ACTION';
  static LISTENER_BROADCAST_INTENT = 'datawedge_broadcast_intent';
  static LISTENER_BARCODE_SCAN = 'barcode_scan';

  sendCommandResult = false;

  static init() {
    DeviceEventEmitter.removeAllListeners(this.LISTENER_BROADCAST_INTENT);
    DeviceEventEmitter.addListener(this.LISTENER_BROADCAST_INTENT, (intent) => {
      this.broadcastReceiver(intent);
    });
    // DataWedgeIntents.registerBroadcastReceiver({
    //   filterActions: [
    //     this.ACTION_NAME,
    //     'com.symbol.datawedge.api.RESULT_ACTION'
    //   ],
    //   filterCategories: [
    //     'android.intent.category.DEFAULT'
    //   ]
    // });
    // HandheldReader.registerReceiver(HandheldReader.ZEBRA_DWINTENTS_ACTION, ''); // For Zebra devices
    // HandheldReader.sendIntent(HandheldReader.ACTION_SOUNDTRIGGER, HandheldReader.DISABLE_SOUND);
    this.determineVersion();
  }

  static destroy() {
    DeviceEventEmitter.removeAllListeners(this.LISTENER_BROADCAST_INTENT);
  }

  static sendCommand(extraName, extraValue) {
    // console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
    let broadcastExtras = {};
    broadcastExtras[extraName] = extraValue;
    broadcastExtras["SEND_RESULT"] = "" + this.sendCommandResult;
    // HandheldReader.sendIntent(extraName, extraValue);
    // DataWedgeIntents.sendBroadcastWithExtras({
    //   action: "com.symbol.datawedge.api.ACTION",
    //   extras: broadcastExtras
    // });
  }

  //  THIS METHOD IS DEPRECATED, please use sendCommand
  static sendIntent(name, value) {
    this.sendCommand(name, value);
  }

  static determineVersion() {
    this.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");
  }

  static setDecoders() {
    //  Set the new configuration
    let profileConfig = {
      "PROFILE_NAME": this.PROFILE_NAME,
      "PROFILE_ENABLED": "true",
      "CONFIG_MODE": "UPDATE",
      "PLUGIN_CONFIG": {
        "PLUGIN_NAME": "BARCODE",
        "PARAM_LIST": {
          //"current-device-id": this.selectedScannerId,
          "scanner_selection": "auto",
          "decoder_ean8": "true", // "true"/"false"
          "decoder_ean13": "true",
          "decoder_code128": "true",
          "decoder_code39": "true"
        }
      }
    };
    this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);
  }

  static broadcastReceiver(intent) {
    //  Broadcast received
    // console.log('Received Intent: ' + JSON.stringify(intent));
    // if (intent.hasOwnProperty('RESULT_INFO')) {
    //   let commandResult = intent.RESULT + " (" +
    //     intent.COMMAND.substring(intent.COMMAND.lastIndexOf('.') + 1, intent.COMMAND.length) + ")";// + JSON.stringify(intent.RESULT_INFO);
    //   console.log(commandResult.toLowerCase());
    // }
    if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_VERSION_INFO')) {
      //  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX
      let versionInfo = intent['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO'];
      console.log('Version Info: ' + JSON.stringify(versionInfo));
      let datawedgeVersion = versionInfo['DATAWEDGE'];
      console.log("Datawedge version: " + datawedgeVersion);
      //  Fire events sequentially so the application can gracefully degrade the functionality available on earlier DW versions
      if (datawedgeVersion >= "6.3")
        this.datawedge63();
      if (datawedgeVersion >= "6.4")
        this.datawedge64();
      if (datawedgeVersion >= "6.5")
        this.datawedge65();
    } else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS')) {
      //  Return from our request to enumerate the available scanners
      // let enumeratedScannersObj = intent['com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'];
      // config enumerate scanner if need
      // console.log('Enumerated Scanners: ', enumeratedScannersObj);
    } else if (intent.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE')) {
      //  Return from our request to obtain the active profile
      let activeProfileObj = intent['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'];
      // config active profile if need
      console.log('Active Profile: ', activeProfileObj);
    } else if (!intent.hasOwnProperty('RESULT_INFO')) {
      //  A barcode has been scanned
      let scannedData = intent["com.symbol.datawedge.data_string"];
      let scannedType = intent["com.symbol.datawedge.label_type"];
      console.log('BARCODE has been scanned: ', scannedData, scannedType);
    }
  }

  static datawedge63() {
    console.log("Datawedge 6.3 APIs are available. Please configure profile manually.");
    //  Create a profile for our application
    this.sendCommand("com.symbol.datawedge.api.CREATE_PROFILE", this.PROFILE_NAME);
    //  Although we created the profile we can only configure it with DW 6.4.
    this.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");
    //  Enumerate the available scanners on the device
    this.sendCommand("com.symbol.datawedge.api.ENUMERATE_SCANNERS", "");
  }

  static datawedge64() {
    console.log("Datawedge 6.4 APIs are available");
    //  Documentation states the ability to set a profile config is only available from DW 6.4.
    //  For our purposes, this includes setting the decoders and configuring the associated app / output params of the profile.
    //  Decoders are now available
    // BarCodeService.setDecoders();

    //  Configure the created profile (associated app and keyboard plugin)
    let profileConfig = {
      "PROFILE_NAME": this.PROFILE_NAME,
      "PROFILE_ENABLED": "true",
      "CONFIG_MODE": "UPDATE", // CREATE_IF_NOT_EXIST / OVERWRITE / UPDATE
      "PLUGIN_CONFIG": {
        "PLUGIN_NAME": "BARCODE",
        "RESET_CONFIG": "true",
        "PARAM_LIST": {
          "scanner_selection": "auto",
          "volume_slider_type": "2", // 0 - Ringer / 1 - Music and Media / 2 - Alarms / 3 - Notification
          "decode_audio_feedback_uri": "''",
          "decode_haptic_feedback": "true" // vibrate
        }
      },
      "APP_LIST": [{
        "PACKAGE_NAME": this.PACKAGE_NAME,
        "ACTIVITY_LIST": ["*"]
      }]
    };
    this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);

    //  Configure the created profile (intent plugin)
    let profileConfig2 = {
      "PROFILE_NAME": this.PROFILE_NAME,
      "PROFILE_ENABLED": "true",
      "CONFIG_MODE": "UPDATE",
      "PLUGIN_CONFIG": {
        "PLUGIN_NAME": "INTENT",
        "RESET_CONFIG": "true",
        "PARAM_LIST": {
          "intent_output_enabled": "true",
          "intent_action": this.ACTION_NAME,
          "intent_delivery": "2",
        }
      }
    };
    this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig2);

    //  Configure the created profile (keystroke plugin)
    let profileConfig3 = {
      "PROFILE_NAME": this.PROFILE_NAME,
      "PROFILE_ENABLED": "true",
      "CONFIG_MODE": "UPDATE",
      "PLUGIN_CONFIG": {
        "PLUGIN_NAME": "KEYSTROKE",
        "RESET_CONFIG": "true",
        "PARAM_LIST": {
          "keystroke_output_enabled": "false",
        }
      }
    };
    this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig3);

    //  Give some time for the profile to settle then query its value
    setTimeout(() => {
      this.sendCommand("com.symbol.datawedge.api.GET_ACTIVE_PROFILE", "");
    }, 1000);
  }

  static datawedge65() {
    console.log("Datawedge 6.5 APIs are available");
    //  Instruct the API to send
    this.sendCommandResult = true;
  }

  static enableScanner() {
    this.sendCommand(this.ACTION_SCANNERINPUTPLUGIN, this.ENABLE_PLUGIN);
  }

  static disableScanner() {
    this.sendCommand(this.ACTION_SCANNERINPUTPLUGIN, this.DISABLE_PLUGIN);
  }

  static toggleScan() {
    this.sendCommand(this.ACTION_SOFTSCANTRIGGER, this.TOGGLE_SCANNING);
  }

  static startScan() {
    this.sendCommand(this.ACTION_SOFTSCANTRIGGER, this.START_SCANNING);
  }

  static stopScan() {
    this.sendCommand(this.ACTION_SOFTSCANTRIGGER, this.STOP_SCANNING);
  }

  static addOnScan(callback) {
    this.enableScanner();
    //Listen for scan events sent from the module
    DeviceEventEmitter.addListener(this.LISTENER_BARCODE_SCAN, callback);
  }

  static removeOnScan() {
    this.disableScanner();
    DeviceEventEmitter.removeAllListeners(this.LISTENER_BARCODE_SCAN);
  }
}
