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
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
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
import {baseUrlProdMiddleware} from "../Constants/production";

var parseString = require("xml2js").parseString;

let SCREENWIDTH = Dimensions.get("screen").width;
let SCREENHEIGHT = Dimensions.get("screen").height;
export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      FirstName: "",
      LastName: "",
      primaryMobile: "",
      dlNo: "",
      medicalStoreAddress: "",
      city: "",
      state: "",
      pinCode: "",
      referralCode: "",
      loading: false,
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  _registeredUser = () => {
    const {primaryMobile, FirstName, LastName, dlNo, medicalStoreAddress, city, state, pinCode, referralCode} = this.state;

    if (FirstName === "") {
      alert('Please enter valid First Name');
      return;
    }

    if (LastName === "") {
      alert('Please enter valid Last Name');
      return;
    }    

    if (primaryMobile.length !== 10) {
      alert('Please enter valid number');
      return;
    }

    if (dlNo === "") {
      alert('Please enter valid dlNo');
      return;
    }
    
    if (medicalStoreAddress === "") {
      alert('Please enter valid medicalStoreAddress');
      return;
    }

    if (city === "") {
      alert('Please enter valid city');
      return;
    }

    if (state === "") {
      alert('Please enter valid state');
      return;
    }

    if (pinCode === "") {
      alert('Please enter valid pinCode');
      return;
    }

    if (referralCode === "") {
      alert('Please enter valid referralCode');
      return;
    }

    this.setModalVisible(true);

    const details = {
      MobileNo: primaryMobile,
      FirstName: FirstName,
      LastName: LastName,
      DLNo: dlNo,
      MedicalStoreAddress: medicalStoreAddress,
      City: city,
      State: state,
      PinCode: pinCode,
      ReferralCode: referralCode,
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

    fetch(baseUrlProdMiddleware + "/Registration", options)
      .then((res) => res.text())
      .then((res) => {
        console.log("res:", res);
        this.setState({
          FirstName: "",
          LastName: "",
          primaryMobile: "",
          dlNo: "",
          medicalStoreAddress: "",
          city: "",
          state: "",
          pinCode: "",
          referralCode: ""
        })
        parseString(res, function (err, result) {
          if (result) {
            console.log("result", result.string._);
            alert("User Created successfully");
          } else {
            Alert.alert(
              "Prime Partner",
              res,
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: false }
            );
          }
        });
      })
      .catch((err) => {
        console.log("error:", err);
        Alert.alert(
          "Prime Partner",
          "",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        // alert(JSON.stringify(err));
      })
      .finally(() => {
        this.setState({ loading: false }, () =>
        this.setModalVisible(false)
      );
      })
  };
  handleBackPress = () => {
    this.props.navigation.navigate("Login"); // works best when the goBack is async
    return true;
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerBack}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Text style={styles.headerBackText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerCenter} disabled>
              <Text style={styles.headerCenterText}>UnRegistered User</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.headerTextView}>
              <Text style={styles.headerText}>
                {" "}
                If you want to join the program fill below details we will
                contact you soon.{" "}
              </Text>
            </View>
            <View>
              <Form style={{ padding: 20 }}>
                <Item inlineLabel style={styles.Item}>
                  {/* <Label>Chemist Name</Label> */}
                  <TextInput
                    style={styles.TextInput}
                    placeholder="First Name"
                    placeholderTextColor="#522e90"
                    onChangeText={(FirstName) => this.setState({ FirstName })}
                    value={this.state.FirstName}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  {/* <Label>Chemist Name</Label> */}
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Last Name"
                    placeholderTextColor="#522e90"
                    onChangeText={(LastName) => this.setState({ LastName })}
                    value={this.state.LastName}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Primary Mobile No"
                    placeholderTextColor="#522e90"
                    onChangeText={(primaryMobile) =>
                      this.setState({ primaryMobile })
                    }
                    value={this.state.primaryMobile}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="DL No."
                    placeholderTextColor="#522e90"
                    onChangeText={(dlNo) => this.setState({ dlNo })}
                    value={this.state.dlNo}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Medical Store Address"
                    placeholderTextColor="#522e90"
                    onChangeText={(medicalStoreAddress) =>
                      this.setState({ medicalStoreAddress })
                    }
                    value={this.state.medicalStoreAddress}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="City"
                    placeholderTextColor="#522e90"
                    onChangeText={(city) => this.setState({ city })}
                    value={this.state.city}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="State"
                    placeholderTextColor="#522e90"
                    onChangeText={(state) => this.setState({ state })}
                    value={this.state.state}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Pincode"
                    placeholderTextColor="#522e90"
                    onChangeText={(pinCode) => this.setState({ pinCode })}
                    value={this.state.pinCode}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  <TextInput
                    style={styles.TextInput}
                    placeholder="Referral Code"
                    placeholderTextColor="#522e90"
                    onChangeText={(referralCode) =>
                      this.setState({ referralCode })
                    }
                    value={this.state.referralCode}
                    // keyboardType='number-pad'
                  />
                </Item>
                <Item inlineLabel style={styles.Item}>
                  <TouchableOpacity
                    style={styles.Submit}
                    onPress={() => this._registeredUser()}
                  >
                    <Text style={{ color: "#fff", alignSelf: "center" }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </Item>
              </Form>
            </View>
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
          >
            <View style={styles.modalView}>
              <ActivityIndicator
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
    backgroundColor: "#FFF",
  },
  context: {
    alignSelf: "center",
    textAlign: "center",
  },
  header: {
    height: SCREENHEIGHT * 0.05,
    backgroundColor: "#522e90",
    flexDirection: "row",
  },
  headerTextView: {
    height: SCREENHEIGHT * 0.1,
    justifyContent: "center",
  },
  headerText: {
    color: "#4a4a4a",
    textAlign: "center",
    alignSelf: "center",
    letterSpacing: 0.8,
    fontSize: 15,
    fontWeight: "300",
  },
  headerBack: {
    width: "35%",
    height: "100%",
  },
  headerBackText: {
    marginLeft: 20,
    color: "#fff",
  },
  headerCenter: {
    width: "60%",
    height: "100%",
  },
  headerCenterText: {
    alignSelf: "flex-start",
    color: "#fff",
  },
  TextInput: {
    borderRadius: 5,
    borderWidth: 0,
    flex: 1,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    height: 40,
    elevation: 4,
  },
  Item: {
    borderBottomWidth: 0,
  },
  Submit: {
    flex: 1,
    height: 40,
    backgroundColor: "#522e90",
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 0,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
  }
});
