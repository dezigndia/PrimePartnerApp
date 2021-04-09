import React from "react";
import { Linking, StatusBar, AsyncStorage, Alert } from "react-native";
import { Provider } from "react-redux";
import { Root, StyleProvider } from "native-base";
import store from "src/store";
import firebase from "react-native-firebase";
import AppWithNavigationState from "./navigators/Navigators";
import VersionCheck from "react-native-version-check";
import DeviceInfo from "react-native-device-info";

const { version } = require("../package.json");

console.disableYellowBox = false;

class App extends React.Component {
  state = {
    currentVersion: null,
    latestVersion: null,
    isNeeded: false,
    storeUrl: "",
  };
  componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
    console.log(
      VersionCheck.getCurrentVersion(),
      "VersionCheck.getCurrentVersion()"
    );
    console.log(DeviceInfo.getVersion(), "DeviceInfo.getVersion()");

    VersionCheck.needUpdate({
      latestVersion: "2.0.10",
    }).then((res) => {
      console.log("needUpdate res", res);
      this.setState(res);
      if (res.isNeeded) {
        Alert.alert(
          "Prime Partner",
          "Update is available for Prime Partner, Please update for better experience",
          [
            { text: "CANCEL", onPress: () => console.warn("OK Pressed") },
            {
              text: "UPDATE",
              onPress: () =>
                Linking.openURL(
                  "market://details?id=com.techvertica.primepartner.beta"
                ),
            },
          ]
        );
      }
    });

    VersionCheck.getStoreUrl({
      appID: "com.techvertica.primepartner.beta",
    }).then((res) => {
      console.log("getStoreUrl res", res);
      this.setState({ storeUrl: res });
    });
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    // alert(fcmToken);
    console.log("fcmToken", fcmToken);

    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
        console.log("fcmToken", fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }
  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        // this.showAlert(title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        // this.showAlert(title, body);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // this.showAlert(title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }
  render() {
    return (
      <Root>
        <StatusBar backgroundColor="#522e90" barStyle="light-content" />
        <Provider store={store}>
          <AppWithNavigationState />
        </Provider>
      </Root>
    );
  }
}

export default App;
