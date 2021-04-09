import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  BackHandler,
} from "react-native";
import Modal from "react-native-modal";
import DeviceInfo from "react-native-device-info";
import baseUrl, { drlUrl } from "../Constants/Constants";
import { baseUrlProd, baseUrlProdMiddleware } from "../Constants/production";
var parseString = require("xml2js").parseString;
import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";

const convert = require("xml-js");

const MEMBERSHIP_LEVELS = ["Silver", "Gold", "Platinum"];

let SCREENWIDTH = Dimensions.get("screen").width;
let SCREEN_HEIGHT = Dimensions.get("screen").height;

export default class Login extends Component {
  static navigationOptions = {
    drawerLockMode: "locked-closed",
  };
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: "",
      otp: "",
      loading: false,
      verifyOtpLoader: false,
      isVisible: false,
      memberLogin: "",
      renderOtpLoader: false,
    };
  }

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };

  componentDidMount() {
    console.log(DeviceInfo.getUniqueId());
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackPress
    );
    // this.checkPermission();
    // this.createNotificationListeners();
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
  }

  getMembership = (nextTier) => {
    if (nextTier === "Silver" || nextTier === "Gold")
      return MEMBERSHIP_LEVELS[0];
    return MEMBERSHIP_LEVELS[1];
  };

  fetchOtp = (renderOtpLoader) => {
    if (this.state.mobileNumber.length !== 10) {
      alert("Please enter valid mobile number!");
      return;
    }
    this.setState({ loading: true });
    const details = {
      Mobile: this.state.mobileNumber,
      RefralCode: "",
    };
    const Body = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    const options = {
      method: "POST",
      body: Body,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    let _that = this;
    fetch(baseUrlProdMiddleware + "/GetOTP", options)
      .then((res) => res.text())
      .then((res) => {
        this.setState({ isVisible: true, loading: false });
        if (renderOtpLoader) {
          _that.setState({ renderOtpLoader: false });
        }
        data = JSON.parse(res);
      })
      .catch((err) => {
        this.setState({ isVisible: false, loading: false });
        Alert.alert(
          "Prime Partner",
          "please enter valid details",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        console.log("error", err);
      });
  };

  getAccountDetails = () => {
    const { dispatch } = this.props.navigation;
    const details = {
      // user: "DRL_API",
      // password: "3JA2ASJx^7",
      memberLogin: this.state.memberLogin,
    };
    const Body = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");
    const options = {
      method: "POST",
      body: Body,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    fetch(baseUrlProd + "/GetDefaultAccountByLogin", options)
      .then((res) => res.text())
      .then((res) => {
        // console.log('------------GetDefaultAccountByLogin res-----------');
        // console.log(res);
        const parsedRes = JSON.parse(res);
        const newRes = JSON.stringify(parsedRes.data);
        // console.log('newRes', newRes);
        const parsedAlteredNewRes = newRes.slice(30, -2);
        // console.log('parsedAlteredNewRes', parsedAlteredNewRes);
        const parsedNewRes = JSON.parse(parsedAlteredNewRes);
        // console.log('------------parsedNewRes--------------');
        // console.log(parsedNewRes);
        this.setState({ isVisible: !this.state.isVisible });
        this.setState({
          AccountID:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.AccountID._text,
          AccountTypeID:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.AccountTypeID._text,
          TotalEarnPoint:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.TotalEarnPoint._text,
          TotalSpentPoint:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.TotalSpentPoint._text,
          TotalExpiredPoint:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.TotalExpiredPoint._text,
          Balance:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.Balance._text,
          AccountStatusCodeID: true,
          CreatedBy:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.CreatedBy._text,
          CreatedOn:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.CreatedOn._text,
          UpdatedBy:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.UpdatedBy._text,
          UpdatedOn:
            parsedNewRes.GetDefaultAccountByLoginResponse
              .GetDefaultAccountByLoginResult.Value.UpdatedOn._text,
        });
        console.log("this.state.mobileNumber", this.state.mobileNumber);
        const User = Object.assign(
          {},
          {
            id: 0,
            mobile: this.state.mobileNumber,
            AccountID:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.AccountID._text,
            AccountTypeID:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.AccountTypeID._text,
            Balance:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.Balance._text,
            ChemistCardNo: this.state.memberLogin,
            DaysRemainingforNextTier: this.state.DaysRemainingforNextTier,
            LastTierUpgradeDate: this.state.LastTierUpgradeDate,
            Membership: this.state.Membership,
            NextTierLevel: this.state.NextTierLevel,
            Output: this.state.Value,
            Points: this.state.Points,
            PointsEarned: this.state.PointsEarned,
            PointsRequired: this.state.PointsRequired,
            TotalEarnPoint:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.TotalEarnPoint._text,
            TotalExpiredPoint:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.TotalExpiredPoint._text,
            TotalSpentPoint:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.TotalSpentPoint._text,
            UpdatedBy:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.UpdatedBy._text,
            UpdatedOn:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.UpdatedOn._text,
            CreatedBy:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.CreatedBy._text,
            CreatedOn:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.CreatedOn._text,
            login: "true",
            password: "password",
          }
        );
        dispatch({
          type: ActionTypes.USER_DATA,
          User,
        });
        Alert.alert(
          "Prime Partner",
          "Login successfully",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );

        const dbState = getState().data;
        const sess = orm.session(dbState);
        console.log("sess", sess);
        this.props.navigation.navigate("MainTab");
      })
      .catch((err) => {
        console.log("error:", err);
        this.setState({ verifyOtpLoader: false });
        alert("GetDefaultAccountByLogin api fail");
        // alert("Something went wrong, please try again!");
      });
  };

  getUserDashboardDetails = () => {
    const details = {
      // user: "DRL_API",
      // password: "3JA2ASJx^7",
      memberLogin: this.state.memberLogin,
    };
    const Body = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");
    const options = {
      method: "POST",
      body: Body,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    fetch(baseUrlProd + "/GetDashboardDetailsOfChemist", options)
      .then((res) => res.text())
      .then((res) => {
        // console.log('GetDashboardDetailsOfChemist res', res);
        const parsedRes = JSON.parse(res);
        const newRes = JSON.stringify(parsedRes.data);
        // console.log('newRes', newRes);
        const parsedAlteredNewRes = newRes.slice(30, -2);
        // console.log('parsedAlteredNewRes', parsedAlteredNewRes);
        const parsedNewRes = JSON.parse(parsedAlteredNewRes);
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        // );
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        //     .GetDashboardDetailsOfChemistResult
        // );
        const memberShip = this.getMembership(
          parsedNewRes.GetDashboardDetailsOfChemistResponse
            .GetDashboardDetailsOfChemistResult.NextTierLevel._text
        );

        // console.log("memberShip", memberShip);
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult.DaysRemainingforNextTier._text",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        //     .GetDashboardDetailsOfChemistResult.DaysRemainingforNextTier._text
        // );
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult.LastTierUpgradeDate._text",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        //     .GetDashboardDetailsOfChemistResult.LastTierUpgradeDate._text
        // );
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult.NextTierLevel._text",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        //     .GetDashboardDetailsOfChemistResult.NextTierLevel._text
        // );
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult.PointsEarned._text",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        //     .GetDashboardDetailsOfChemistResult.PointsEarned._text
        // );
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult.PointsRequired._text,",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        //     .GetDashboardDetailsOfChemistResult.PointsRequired._text
        // );
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult.Value._text",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        //     .GetDashboardDetailsOfChemistResult.Value._text
        // );
        // console.log(
        //   "parsedNewRes.GetDashboardDetailsOfChemistResponse",
        //   parsedNewRes.GetDashboardDetailsOfChemistResponse
        // );

        this.setState(
          {
            DaysRemainingforNextTier:
              parsedNewRes.GetDashboardDetailsOfChemistResponse
                .GetDashboardDetailsOfChemistResult.DaysRemainingforNextTier
                ._text,
            LastTierUpgradeDate:
              parsedNewRes.GetDashboardDetailsOfChemistResponse
                .GetDashboardDetailsOfChemistResult.LastTierUpgradeDate._text,
            NextTierLevel:
              parsedNewRes.GetDashboardDetailsOfChemistResponse
                .GetDashboardDetailsOfChemistResult.NextTierLevel._text,
            PointsEarned:
              parsedNewRes.GetDashboardDetailsOfChemistResponse
                .GetDashboardDetailsOfChemistResult.PointsEarned._text,
            Points:
              parsedNewRes.GetDashboardDetailsOfChemistResponse
                .GetDashboardDetailsOfChemistResult.PointsEarned._text,
            PointsRequired:
              parsedNewRes.GetDashboardDetailsOfChemistResponse
                .GetDashboardDetailsOfChemistResult.PointsRequired._text,
            Value:
              parsedNewRes.GetDashboardDetailsOfChemistResponse
                .GetDashboardDetailsOfChemistResult.Value._text,
            Membership: memberShip,
          },
          () => {
            // console.log(
            //   "DaysRemainingforNextTier",
            //   this.state.DaysRemainingforNextTier
            // );
            // console.log("LastTierUpgradeDate", this.state.LastTierUpgradeDate);
            // console.log("NextTierLevel", this.state.NextTierLevel);
            // console.log("PointsEarned", this.state.PointsEarned);
            // console.log("Points", this.state.Points);
            // console.log("PointsRequired", this.state.PointsRequired);
            // console.log("Value", this.state.Value);
            // console.log("Membership", this.state.Membership);
          }
        );
        this.getAccountDetails();
      })
      .catch((err) => {
        // alert("error:", err.message);
        alert(err.message);
        console.log("error:", err.message);
        this.setState({ verifyOtpLoader: false });
        alert("GetDashboardDetailsOfChemist api failed!");
        // alert("Something went wrong, please try again!");
      });
  };

  getUserCardNumber = () => {
    const details = {
      // user: "DRL_API",
      // password: "3JA2ASJx^7",
      MobileNo: this.state.mobileNumber,
    };
    const Body = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");
    const options = {
      method: "POST",
      body: Body,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    fetch(baseUrlProdMiddleware + "/GetChemistCardNoByMobileNo", options)
      .then((res) => res.text())
      .then((res) => {
        // console.log('GetChemistCardNoByMobileNo response', res);
        parseString(res, async (err, result) => {
          // console.log('GetChemistCardNoByMobileNo result', result);
          // console.log('GetChemistCardNoByMobileNo result', result.string);
          // console.log('GetChemistCardNoByMobileNo result', result.string._);
          this.setState(
            {
              memberLogin: Number(result.string._),
            },
            () => {
              this.getUserDashboardDetails();
              // alert(this.state.memberLogin, "this.state.memberLogin");
            }
          );
        });
        // const xml = convert.xml2json(res, {
        //   compact: true,
        //   spaces: 4,
        // });
        // const memberLogin = JSON.parse(xml).string._text;
        // console.log('xml', xml, JSON.parse(xml).string._text);
        // console.log('GCCNBMN', JSON.parse(xml).string._text);
        // console.log('GCCNBMN-TYPE', typeof JSON.parse(xml).string._text);
      })
      .catch((err) => {
        console.log("error:", err);
        this.setState({ verifyOtpLoader: false });
        alert("GetChemistCardNoByMobileNo api fail");
        // alert("Something went wrong, please try again!");
      });
  };

  verifyOtp = () => {
    if (this.state.otp.length !== 4) {
      alert("Please enter valid OTP");
      return;
    }
    // console.log("this.state.otp", this.state.otp);
    this.setState({ verifyOtpLoader: true });
    const details = {
      // staging params
      // user: 'DRL_API',
      // password: '3JA2ASJx^7',

      // prod params
      Mobile: this.state.mobileNumber,
      OTP: this.state.otp,
    };
    const Body = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    const options = {
      method: "POST",
      body: Body,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    fetch(baseUrlProdMiddleware + "/MatchOTP", options)
      .then((res) => res.text())
      .then((res) => {
        let data = JSON.parse(res);
        if (data[0].result === "Success") {
          ToastAndroid.show("OTP verified successfully!", ToastAndroid.SHORT);
          this.getUserCardNumber();
        } else {
          this.setState({ verifyOtpLoader: false });
          Alert.alert(
            "Prime Partner",
            "Invalid entered OTP",
            [
              {
                text: "OK",
                onPress: () =>
                  this.setState({
                    otp: "",
                  }),
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((err) => {
        this.setState({ verifyOtpLoader: false });
        console.log("error:", err);
        alert("MatchOtp api fail");
        Alert.alert(
          "Prime Partner",
          "Invalid entered OTP",
          [
            {
              text: "OK",
              onPress: () =>
                this.setState({
                  code: "",
                }),
            },
          ],
          { cancelable: false }
        );
      });
  };

  //     //1
  // async checkPermission() {
  //     const enabled = await firebase.messaging().hasPermission();
  //     if (enabled) {
  //         this.getToken();
  //     } else {
  //         this.requestPermission();
  //     }
  //   }

  //     //3
  //   async getToken() {
  //     let fcmToken = await AsyncStorage.getItem('fcmToken');
  //     if (!fcmToken) {
  //         fcmToken = await firebase.messaging().getToken();
  //         if (fcmToken) {
  //             // user has a device token
  //             await AsyncStorage.setItem('fcmToken', fcmToken);
  //             console.log("fcmToken",fcmToken);
  //         }
  //     }
  //   }

  //     //2
  //   async requestPermission() {
  //     try {
  //         await firebase.messaging().requestPermission();
  //         // User has authorised
  //         this.getToken();
  //     } catch (error) {
  //         // User has rejected permissions
  //         console.log('permission rejected');
  //     }
  //   }

  // setModalVisible(visible) {
  //   this.setState({ modalVisible: visible });
  // }

  // _onLogin = async () => {
  //   let fcmToken = await AsyncStorage.getItem("fcmToken");
  //   const details = {
  //     MobileNo: this.state.userName,
  //     Password: this.state.password,
  //     // 'MobileNo': '8879755940',
  //     // 'Password':'poonam',
  //     DeviceID: DeviceInfo.getUniqueId(),
  //   };
  //   const Body = Object.keys(details)
  //     .map(
  //       (key) =>
  //         encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
  //     )
  //     .join("&");
  //   console.warn("details", details);
  //   const options = {
  //     method: "POST",
  //     body: Body,
  //     headers: {
  //       Accept: "multipart/form-data",
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   };
  //   var _that = this;
  //   fetch(baseUrl + "/PrimaLogin", options)
  //     .then((res) => res.text())
  //     .then((res) => {
  //       this.setState({ loading: false }, () =>
  //         this.setModalVisible(!this.state.modalVisible)
  //       );
  //       parseString(res, function (err, result) {
  //         if (result.Value.AccountID[0] != "NA") {
  //           console.log("result", result.Value, _that.props.navigation);
  //           const { dispatch } = _that.props.navigation;
  //           const User = Object.assign(
  //             {},
  //             {
  //               id: 0,
  //               mobile: _that.state.userName,
  //               AccountID: result.Value.AccountID[0],
  //               AccountTypeID: result.Value.AccountTypeID[0],
  //               Balance: result.Value.Balance[0],
  //               ChemistCardNo: result.Value.ChemistCardNo[0],
  //               DaysRemainingforNextTier:
  //                 result.Value.DaysRemainingforNextTier[0],
  //               LastTierUpgradeDate: result.Value.LastTierUpgradeDate[0],
  //               Membership: result.Value.Membership[0],
  //               NextTierLevel: result.Value.NextTierLevel[0],
  //               Output: result.Value.Output[0],
  //               Points: result.Value.Points[0],
  //               PointsEarned: result.Value.PointsEarned[0],
  //               PointsRequired: result.Value.PointsRequired[0],
  //               TotalEarnPoint: result.Value.TotalEarnPoint[0],
  //               TotalExpiredPoint: result.Value.TotalExpiredPoint[0],
  //               TotalSpentPoint: result.Value.TotalSpentPoint[0],
  //               UpdatedBy: result.Value.UpdatedBy[0],
  //               UpdatedOn: result.Value.UpdatedOn[0],
  //               CreatedBy: result.Value.CreatedBy[0],
  //               login: "true",
  //               password: _that.state.password,
  //             }
  //           );
  //           dispatch({
  //             type: ActionTypes.USER_DATA,
  //             User,
  //           });
  //           _that.props.navigation.navigate("MainTab");
  //           Alert.alert(
  //             "Prime Partner",
  //             "Login successfully",
  //             [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //             { cancelable: false }
  //           );
  //           // alert('Login successfully');
  //           const dbState = getState().data;
  //           const sess = orm.session(dbState);
  //           console.log("sess", sess);
  //         } else {
  //           if (
  //             result.Value.ChemistCardNo[0] === "Mobile number does not exist"
  //           ) {
  //             Alert.alert(
  //               "Prime Partner",
  //               result.Value.ChemistCardNo[0],
  //               [
  //                 {
  //                   text: "OK",
  //                   onPress: () => _that.props.navigation.navigate("SignUp"),
  //                 },
  //               ],
  //               { cancelable: false }
  //             );
  //           } else {
  //             Alert.alert(
  //               "Prime Partner",
  //               result.Value.ChemistCardNo[0],
  //               [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //               { cancelable: false }
  //             );
  //           }

  //           // alert(result.Value.ChemistCardNo[0])
  //           // this.setModalVisible(!this.state.modalVisible);
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       this.setState({ loading: false }, () =>
  //         this.setModalVisible(!this.state.modalVisible)
  //       );
  //       Alert.alert(
  //         "Prime Partner",
  //         "Check your internet connection!",
  //         [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //         { cancelable: false }
  //       );
  //       console.log("err", err);
  //     });
  // };

  render() {
    const {
      mobileNumber,
      loading,
      verifyOtpLoader,
      verificationCode,
    } = this.state;

    const handleOnResendOTPClick = () => {
      this.setState({ renderOtpLoader: true });
      this.fetchOtp("renderOtpLoader");
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/background.png")}
            style={styles.imageBackground}
          >
            <View style={styles.imagesView}>
              <View style={styles.reddysImageView}>
                {/* <Text>image 1</Text> */}
                <Image
                  source={require("../assets/drreddy.png")}
                  style={styles.reddysImage}
                />
              </View>
              <View style={styles.primePartnerView}>
                <Image
                  source={require("../assets/primePartner.png")}
                  style={styles.primePartnerImage}
                />
                {/* <Text>image 2</Text> */}
              </View>
            </View>
            <View style={styles.contentWrapper}>
              <TextInput
                style={[styles.TextInput]}
                autoFocus
                placeholder="Enter 10 digit Mobile Number"
                placeholderTextColor="#522e90"
                value={mobileNumber}
                onChangeText={(text) => this.setState({ mobileNumber: text })}
                maxLength={10}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[styles.requestButton]}
                onPress={() => this.fetchOtp()}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.otpRequestText}>Request OTP</Text>
                )}
              </TouchableOpacity>
            </View>
            <Modal
              isVisible={this.state.isVisible}
              avoidKeyboard={true}
              backdropOpacity={0.2}
              style={{
                margin: 0,
                padding: 0,
                marginTop: SCREEN_HEIGHT / 8,
              }}
              onBackButtonPress={() =>
                this.setState({
                  isVisible: false,
                })
              }
              onBackdropPress={() =>
                this.setState({
                  isVisible: false,
                })
              }
            >
              <View
                style={{
                  flex: 1,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  backgroundColor: "#fff",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 8,
                    justifyContent: "flex-start",
                    borderBottomWidth: 1,
                    borderBottomColor: "#efefef",
                    elevation: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#522e90",
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "200",
                      marginVertical: 10,
                    }}
                  >
                    Verify OTP
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={[styles.TextInput]}
                    placeholder="Enter OTP"
                    placeholderTextColor="#522e90"
                    value={verificationCode}
                    onChangeText={(text) => this.setState({ otp: text })}
                    maxLength={4}
                    keyboardType="number-pad"
                  />
                  <TouchableOpacity
                    style={styles.requestButton}
                    onPress={() => this.verifyOtp()}
                  >
                    {verifyOtpLoader ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.otpRequestText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={handleOnResendOTPClick}
                  onLongPress={handleOnResendOTPClick}
                  activeOpacity={0.6}
                  style={styles.requestButton}
                >
                  {this.state.renderOtpLoader ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.otpRequestText}>Resend OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
            </Modal>
            {/* <View style={styles.formView}>
              <Form style={styles.form}>
                <Item inlineLabel style={styles.item}>
                  <TextInput
                    style={styles.inputUsername}
                    placeholder="Registered Mobile No"
                    placeholderTextColor="#522e90"
                    onChangeText={(userName) => this.setState({ userName })}
                    keyboardType="number-pad"
                  />
                </Item>
                <Item style={styles.item}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Password"
                    placeholderTextColor="#522e90"
                    onChangeText={(password) => this.setState({ password })}
                    secureTextEntry={true}
                  />
                </Item>
                <Item inlineLabel style={styles.item}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                      if (
                        this.state.userName != "" &&
                        this.state.userName.length == 10
                      ) {
                        this.setState({ loading: true }, () => {
                          this._onLogin();
                          this.setModalVisible(true);
                        });
                      } else {
                        Alert.alert(
                          "Prime Partner",
                          "Please enter the valid details",
                          [
                            {
                              text: "OK",
                              onPress: () => console.log("OK Pressed"),
                            },
                          ],
                          { cancelable: false }
                        );
                      }
                    }}
                  >
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>
                </Item>
                <Item style={[styles.itemForgotPassword]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("ForgotPassword")
                    }
                  >
                    <Text style={styles.textForgetPassword}>
                      Forget Password ?
                    </Text>
                  </TouchableOpacity>
                </Item>
              </Form>
            </View> */}
            <View style={styles.enrollView}>
              <Text
                onPress={() => this.props.navigation.navigate("SignUp")}
                style={styles.enrollText}
              >
                Not Prime Partner? Enroll Now.
              </Text>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  context: {
    alignSelf: "center",
    textAlign: "center",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  imagesView: {
    height: SCREEN_HEIGHT / 3.5,
    borderWidth: 0,
  },
  reddysImageView: {
    height: "20%",
    borderWidth: 0,
  },
  reddysImage: {
    height: 25,
    width: 120,
    alignSelf: "flex-end",
    right: 10,
    top: 10,
    bottom: 0,
  },
  primePartnerView: {
    height: "80%",
    borderWidth: 0,
    justifyContent: "center",
  },
  primePartnerImage: {
    alignSelf: "center",
    height: SCREENWIDTH / 5,
    width: SCREENWIDTH / 2,
  },
  formView: {
    // height:SCREENHEIGHT/3,
    borderWidth: 0,
  },
  form: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 40,
  },
  item: {
    borderBottomWidth: 0,
  },
  inputUsername: {
    borderRadius: 20,
    borderWidth: 0,
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 7,
    height: 40,
  },
  inputPassword: {
    borderRadius: 20,
    borderWidth: 0,
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 7,
    height: 40,
  },
  loginButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#522e90",
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 0,
  },
  loginText: {
    color: "#fff",
    alignSelf: "center",
  },
  itemForgotPassword: {
    justifyContent: "center",
    borderBottomWidth: 0,
    margin: 10,
  },
  textForgetPassword: {
    fontSize: 16,
    alignSelf: "center",
    bottom: 0,
  },
  enrollView: {
    // height:SCREENHEIGHT/3,
    borderWidth: 0,
    marginTop: 30,
  },
  enrollText: {
    color: "#88bffa",
    alignSelf: "center",
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  spinner: {
    alignSelf: "center",
  },
  TextInput: {
    borderRadius: 5,
    borderWidth: 0,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    height: 40,
    elevation: 4,
    width: "90%",
    paddingLeft: 15,
  },
  contentWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  requestButton: {
    height: 40,
    backgroundColor: "#522e90",
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 0,
    width: "90%",
  },
  otpRequestText: {
    color: "#fff",
    alignSelf: "center",
  },
  resendOtpTextWrapper: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    elevation: 5,
    zIndex: 1,
    marginRight: 20,
    marginTop: 20,
    height: 40,
    width: 140,
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "flex-end",
  },
  resendOtpText: {
    color: "#ffffff",
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  renderOtpLoader: {
    fontSize: 16,
  },
});
