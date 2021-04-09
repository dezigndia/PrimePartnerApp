import React from "react";
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import baseUrl, { drlUrl } from "../Constants/Constants";
import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";

const convert = require("xml-js");

const SCREEN_HEIGHT = Dimensions.get("screen").height;

const MEMBERSHIP_LEVELS = ["SILVER", "GOLD", "PLATINUM"];

class RequestOTP extends React.Component {
  state = {
    mobileNumber: "",
    otp: "",
    loading: false,
    verifyOtpLoader: false,
    isVisible: false,
    memberLogin: "",
  };

  getMembership = (nextTier) => {
    if (nextTier === "SILVER" || nextTier === "GOLD")
      return MEMBERSHIP_LEVELS[0];
    return MEMBERSHIP_LEVELS[1];
  };

  fetchOtp = () => {
    this.setState({ isVisible: true });

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

    fetch(baseUrl + "/GetOTP", options)
      .then((res) => res.text())
      .then((res) => {
        this.setState({ isVisible: true, loading: false });
        data = JSON.parse(res);
      })
      .catch((err) => {
        this.setState({ loading: false });
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
      user: "DRL_API",
      password: "3JA2ASJx^7",
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

    fetch(drlUrl + "/GetDefaultAccountByLogin", options)
      .then((res) => res.text())
      .then((res) => {
        const xml = convert.xml2json(res, {
          compact: true,
          spaces: 4,
        });
        const parsedXml = JSON.parse(xml);
        this.setState({ isVisible: !this.state.isVisible });
        this.setState({
          AccountID:
            parsedXml.ReturnObjectOfAccountEntity.Value.AccountID._text,
          AccountTypeID:
            parsedXml.ReturnObjectOfAccountEntity.Value.AccountTypeID._text,
          TotalEarnPoint:
            parsedXml.ReturnObjectOfAccountEntity.Value.TotalEarnPoint._text,
          TotalSpentPoint:
            parsedXml.ReturnObjectOfAccountEntity.Value.TotalSpentPoint._text,
          TotalExpiredPoint:
            parsedXml.ReturnObjectOfAccountEntity.Value.TotalExpiredPoint._text,
          Balance: parsedXml.ReturnObjectOfAccountEntity.Value.Balance._text,
          AccountStatusCodeID: true,
          CreatedBy:
            parsedXml.ReturnObjectOfAccountEntity.Value.CreatedBy._text,
          CreatedOn:
            parsedXml.ReturnObjectOfAccountEntity.Value.CreatedOn._text,
          UpdatedBy:
            parsedXml.ReturnObjectOfAccountEntity.Value.UpdatedBy._text,
          UpdatedOn:
            parsedXml.ReturnObjectOfAccountEntity.Value.UpdatedOn._text,
        });
        const User = Object.assign(
          {},
          {
            id: 0,
            mobile: this.state.mobileNumber,
            AccountID:
              parsedXml.ReturnObjectOfAccountEntity.Value.AccountID._text,
            AccountTypeID:
              parsedXml.ReturnObjectOfAccountEntity.Value.AccountTypeID._text,
            Balance: parsedXml.ReturnObjectOfAccountEntity.Value.Balance._text,
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
              parsedXml.ReturnObjectOfAccountEntity.Value.TotalEarnPoint._text,
            TotalExpiredPoint:
              parsedXml.ReturnObjectOfAccountEntity.Value.TotalExpiredPoint
                ._text,
            TotalSpentPoint:
              parsedXml.ReturnObjectOfAccountEntity.Value.TotalSpentPoint._text,
            UpdatedBy:
              parsedXml.ReturnObjectOfAccountEntity.Value.UpdatedBy._text,
            UpdatedOn:
              parsedXml.ReturnObjectOfAccountEntity.Value.UpdatedOn._text,
            CreatedBy:
              parsedXml.ReturnObjectOfAccountEntity.Value.CreatedBy._text,
            CreatedOn:
              parsedXml.ReturnObjectOfAccountEntity.Value.CreatedOn._text,
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
        alert('GetDefaultAccountByLogin api fail');
        alert("Something went wrong, please try again!");
      });
  };

  getUserDashboardDetails = () => {
    const details = {
      user: "DRL_API",
      password: "3JA2ASJx^7",
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

    fetch(drlUrl + "/GetDashboardDetailsOfChemist", options)
      .then((res) => res.text())
      .then((res) => {
        const xml = convert.xml2json(res, {
          compact: true,
          spaces: 4,
        });
        const parsedXml = JSON.parse(xml);
        const memberShip = this.getMembership(
          parsedXml.DashboardDetails.NextTierLevel._text
        );
        this.setState({
          DaysRemainingforNextTier:
            parsedXml.DashboardDetails.DaysRemainingforNextTier._text,
          LastTierUpgradeDate:
            parsedXml.DashboardDetails.LastTierUpgradeDate._text,
          NextTierLevel: parsedXml.DashboardDetails.NextTierLevel._text,
          PointsEarned: parsedXml.DashboardDetails.PointsEarned._text,
          Points: parsedXml.DashboardDetails.PointsEarned._text,
          PointsRequired: parsedXml.DashboardDetails.PointsRequired._text,
          Value: parsedXml.DashboardDetails.Value._text,
          Membership: memberShip,
        });
        this.getAccountDetails();
      })
      .catch((err) => {
        console.log("error:", err);
        this.setState({ verifyOtpLoader: false });
        alert('GetDashboardDetailsOfChemist api fail');
        alert("Something went wrong, please try again!");
      });
  };

  getUserCardNumber = () => {
    const details = {
      user: "DRL_API",
      password: "3JA2ASJx^7",
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
    fetch(drlUrl + "/GetChemistCardNoByMobileNo", options)
      .then((res) => res.text())
      .then((res) => {
        const xml = convert.xml2json(res, {
          compact: true,
          spaces: 4,
        });
        this.setState({
          memberLogin: JSON.parse(xml).ArrayOfGetChemistCardNoResponse
            .GetChemistCardNoResponse.ChemistCardNo._text,
        });
        this.getUserDashboardDetails();
      })
      .catch((err) => {
        console.log("error:", err);
        this.setState({ verifyOtpLoader: false });
        alert('GetChemistCardNoByMobileNo api fail');
        alert("Something went wrong, please try again!");
      });
  };

  verifyOtp = () => {
    if (this.state.otp.length !== 4) {
      alert('Please enter valid OTP');
      return;
    }
    console.log('this.state.otp', this.state.otp);
    this.setState({ verifyOtpLoader: true });
    const details = {
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

    fetch(baseUrl + "/MatchOTP", options)
      .then((res) => res.text())
      .then((res) => {
        let data = JSON.parse(res);
        if (data[0].result === "Success") {
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
        alert('MatchOtp api fail');
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

  render() {
    const { mobileNumber, loading, verifyOtpLoader, isVisible, verificationCode } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/background.png")}
            style={styles.imageBackground}
          >
            <View style={styles.header}>
              <Text
                onPress={() => this.props.navigation.navigate("Login")}
                style={styles.headerBackText}
              >
                Back
              </Text>
              <Text style={styles.headerCenterText}>Request OTP</Text>
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
              isVisible={isVisible}
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
              </View>
            </Modal>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

export default RequestOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "#522e90",
    flexDirection: "row",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerBackText: {
    marginLeft: "5%",
    color: "#fff",
  },
  headerCenterText: {
    paddingLeft: "30%",
    color: "#fff",
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
    paddingTop: SCREEN_HEIGHT / 3,
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
});
