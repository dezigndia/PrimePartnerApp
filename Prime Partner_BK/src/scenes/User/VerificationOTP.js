import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  BackHandler,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Image,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
} from "native-base";
import baseUrl, {
  baseUrlProd,
  baseUrlProdMiddleware,
} from "../Constants/production";
import XMLParser from "react-xml-parser";
var parseString = require("xml2js").parseString;
import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";

let SCREENWIDTH = Dimensions.get("screen").width;
let SCREENHEIGHT = Dimensions.get("screen").height;
// import xml2json from '../Xml2Json/Xml2Json';

export default class VerificationOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      loading: false,
      modalVisible: false,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    // this.goBack(); // works best when the goBack is async
    return true;
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  _getChemistNo = () => {
    try {
      const details = {
        MobileNo: this.props.navigation.state.params.mobile,
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
          console.log("res:", res);
          parseString(res, async (err, result) => {
            if (result.string._ !== "Not Mentioned") {
              const { dispatch } = this.props.navigation;
              const User = Object.assign(
                {},
                {
                  id: 0,
                  ChemistCardNo: result.string._,
                }
              );
              dispatch({
                type: ActionTypes.USER_DATA,
                User,
              });
              this.props.navigation.navigate("NewPassword", {
                ChemistCardNo: result.string._,
              });
            } else {
              Alert.alert(
                "Prime Partner",
                "Number Not Registered",
                [
                  {
                    text: "OK",
                    onPress: () => this.props.navigation.navigate("Login"),
                  },
                ],
                { cancelable: false }
              );
            }
            console.log("result", result.string._);
          });
        });
    } catch (er) {
      _that.setState({
        loading: false,
      });
      console.log("er", er);
    }
  };

  _getOTP = () => {
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { mobile } = User.ref;
      console.log("mobile", mobile);
      if (mobile === "" || mobile == undefined) {
        this.setState({ resendOtpLoader: false });
        ToastAndroid.show(
          "something went wrong! please Re-Login",
          ToastAndroid.SHORT
        );
        return;
      }
      const details = {
        Mobile: mobile,
        RefralCode: "getOTP",
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

      fetch(baseUrlProdMiddleware + "/GetOTP", options)
        .then((res) => res.text())
        .then((res) => {
          this.setState({ resendOtpLoader: false });

          data = JSON.parse(res);
          console.log(":res", data[0].OTP);
          // alert('otp is:'+data[0].OTP);
        //   this.props.navigation.navigate("VerifyRedeemtionOTP", {
        //     mobile: mobile,
        //     GiftReference: this.props.navigation.state.params.GiftReference,
        //     Points: this.props.navigation.state.params.Points,
        //     Itemname: this.props.navigation.state.params.Itemname,
        //     ImageURL: this.props.navigation.state.params.ImageURL,
        //   });
        })
        .catch((err) => {
          this.setState({ resendOtpLoader: false });
          console.log("error", err);
        });
    } else {
      ToastAndroid.show(
        "something went wrong! please try again",
        ToastAndroid.SHORT
      );
      return;
    }
  };

  _verifyOTP = () => {
    const details = {
      Mobile: this.props.navigation.state.params.mobile,
      OTP: this.state.code,
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

    fetch(baseUrlProd + "/MatchOTP", options)
      .then((res) => res.text())
      .then((res) => {
        this.setState({ loading: false }, () =>
          this.setModalVisible(!this.state.modalVisible)
        );
        let data = JSON.parse(res);
        console.log("data:", res);
        if (data[0].result === "Success") {
          this._getChemistNo();
        } else {
          Alert.alert(
            "Prime Partner",
            "Invalid entered OTP",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        }
      })
      .catch((err) => {
        console.log("error:", err);
        Alert.alert(
          "Prime Partner",
          "Invalid entered OTP",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      });
  };
  render() {
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
            <View style={{ borderWidth: 0 }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 20,
                  color: "#72c8f2",
                  alignSelf: "center",
                  letterSpacing: 0.8,
                }}
              >
                Verification Code
              </Text>
              <Text
                style={{
                  fontWeight: "200",
                  color: "#a9b9bf",
                  alignSelf: "center",
                  textAlign: "center",
                  marginLeft: 20,
                  marginRight: 20,
                  fontSize: 16,
                  letterSpacing: 0.8,
                }}
              >
                A Verification code has been sent to your registered no. Enter
                the Code and submit.
              </Text>
            </View>
            <View style={styles.formView}>
              <Form style={styles.form}>
                <Item style={styles.item}>
                  <TextInput
                    style={styles.inputVerification}
                    placeholder="Verification Code"
                    placeholderTextColor="#522e90"
                    onChangeText={(code) => this.setState({ code })}
                    secureTextEntry={false}
                    keyboardType="phone-pad"
                  />
                </Item>
                <Item inlineLabel style={styles.item}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                      if (
                        this.state.code != "" &&
                        this.state.code.length == 4
                      ) {
                        this.setState({ loading: true }, () => {
                          this._verifyOTP();
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
                    <Text style={styles.SubmitText}>Submit</Text>
                  </TouchableOpacity>
                </Item>

                <Item inlineLabel style={styles.item}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                        this.setState({ resendOtpLoader: true });
                        this._getOTP();
                    }}
                  >
                    {this.state.resendOtpLoader ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.SubmitText}>
                        Resend verification code
                      </Text>
                    )}
                  </TouchableOpacity>
                </Item>

                {/* <Item style={styles.iteResendPassword}>
                  <TouchableOpacity onPress={() => this._getOTP()}>
                    <Text style={styles.textResendPassword}>
                      Resend verification code
                    </Text>
                  </TouchableOpacity>
                </Item> */}
              </Form>
            </View>
          </ImageBackground>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
            }}
          >
            <View style={styles.modalView}>
              <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="#0000ff"
              />
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent:'center',
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
    height: SCREENHEIGHT / 3.5,
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
    right: 20,
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
    paddingTop: 20,
  },
  item: {
    borderBottomWidth: 0,
  },
  inputVerification: {
    borderRadius: 10,
    borderWidth: 0,
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 7,
    height: 40,
    elevation: 4,
  },
  submitButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#522e90",
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 0,
    marginTop: 7,
  },
  SubmitText: {
    color: "#fff",
    alignSelf: "center",
  },
  iteResendPassword: {
    justifyContent: "center",
    borderBottomWidth: 0,
    margin: 10,
  },
  textResendPassword: {
    fontSize: 16,
    alignSelf: "center",
    bottom: 0,
    color: "#a9b9bf",
  },
  enrollView: {
    height: SCREENHEIGHT / 3,
    borderWidth: 0,
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
});
