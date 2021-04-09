import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import AnimateNumber from "react-native-countup";
import orm from "src/data";
import { getState } from "src/storeHelper";
import { baseUrlProdMiddleware, baseUrlProd } from "../Constants/production";
var parseString = require("xml2js").parseString;
import { NavigationEvents } from "react-navigation";
import ApproveModal from "../../common/Modal/Modal";
export default class EarnPoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      modalVisible: false,
      TotalEarnPoint: "",
      isVisible: false,
      showCancel: true,
      deliveryIds: [],
    };
  }

  setModalStatus = () => {
    const dbState = getState().data;
    const sess = orm.session(dbState);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { AccountID } = User.ref;
      const statusDetails = {
        memberId: AccountID,
        type: "LastOrdersStatus",
      };

      const statusBody = Object.keys(statusDetails)
        .map(
          (key) =>
            encodeURIComponent(key) +
            "=" +
            encodeURIComponent(statusDetails[key])
        )
        .join("&");

      const statusOptions = {
        method: "POST",
        body: statusBody,
        headers: {
          Accept: "multipart/form-data",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      fetch(baseUrlProd + "/GetDetailsByType", statusOptions)
        .then((res) => res.text())
        .then((res) => {
          // console.log('GetDetailsByType res', res)
          const parsedRes = JSON.parse(res);
          const newRes = JSON.stringify(parsedRes.data);
          // console.log('newRes', newRes);
          const parsedAlteredNewRes = newRes.slice(30, -2);
          // console.log('parsedAlteredNewRes', parsedAlteredNewRes);
          const parsedXml = JSON.parse(parsedAlteredNewRes);

          // const parsedXml = JSON.parse(xml);
          console.log("parsedXml", parsedXml);
          if (Object.keys(parsedXml.GetDetailsByTypeResponse).length > 0) {
            if (
              Object.keys(
                parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                  "diffgr:diffgram"
                ]
              ).length === 0
            ) {
              this.setState({ deliveryIds: [...this.state.deliveryIds] });
            } else {
              if (
                !Array.isArray(
                  parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                    "diffgr:diffgram"
                  ].NewDataSet.Table
                )
              ) {
                let arr = [];
                if (
                  parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                    "diffgr:diffgram"
                  ].NewDataSet.Table.Status._text === "Delivered"
                ) {
                  arr.push(
                    parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                      "diffgr:diffgram"
                    ].NewDataSet.Table.OrderID._text
                  );
                }
                console.log("object => ", arr);
                this.setState({
                  deliveryIds: [
                    ...new Set([...this.state.deliveryIds, ...arr]),
                  ],
                });
              }

              if (
                Array.isArray(
                  parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                    "diffgr:diffgram"
                  ].NewDataSet.Table
                )
              ) {
                let arr = [];
                parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                  "diffgr:diffgram"
                ].NewDataSet.Table.map((item) => {
                  if (item.Status._text === "Delivered") {
                    arr.push(item.OrderID._text);
                  }
                });
                console.log("array => ", arr);
                this.setState({
                  deliveryIds: [...this.state.deliveryIds, ...arr],
                });
              }
            }
          }
        })
        .catch((err) => console.log("GetDetailsByType err", err));
    }
  };

  _onSubmit = () => {
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { id, ChemistCardNo, mobile, TotalEarnPoint } = User.ref;

      const details = {
        memberLogin: ChemistCardNo,
        VoucherCode: this.state.code,
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
      var _that = this;
      fetch(baseUrlProdMiddleware + "/GetEarnPoints", options)
        .then((res) => res.text())
        .then((res) => {
          this.setState({ loading: false }, () =>
            this.setModalVisible(!this.state.modalVisible)
          );
          console.log("data:", res);
          this.setState({
            code: "",
          });
          parseString(res, async (err, result) => {
            console.log("result", result);
            if (result.string._ === "Voucher code has already been used") {
              Alert.alert(
                "Prime Partner",
                result.string._,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            } else if (
              result.string._ ===
              "Sorry!! You do not have permission to scan the Code."
            ) {
              Alert.alert(
                "Prime Partner",
                result.string._,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            } else if (result.string._ === "Wrong VoucherCode") {
              Alert.alert(
                "Prime Partner",
                result.string._,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            } else if (result.string._ === "Invalid VoucherCode") {
              Alert.alert(
                "Prime Partner",
                result.string._,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            } else if (result.string._ === "SKU is blocked") {
              Alert.alert(
                "Prime Partner",
                result.string._,
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
              );
            } else {
              _that.props.navigation.navigate("Congratulations", {
                message: result.string._,
              });
            }
          });
        })
        .catch((err) => {
          console.log("error:", err);
          this.setState({ loading: false }, () =>
            this.setModalVisible(!this.state.modalVisible)
          );
          Alert.alert(
            "Prime Partner",
            JSON.stringify(err),
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        });
    }
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _getTotalEarnPoints = () => {
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { id, ChemistCardNo, mobile, TotalEarnPoint, Balance } = User.ref;
      this.setState({
        TotalEarnPoint: parseInt(Balance),
      });
      const details = {
        memberLogin: ChemistCardNo,
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
      _that = this;
      fetch(baseUrlProdMiddleware + "/GetOrderByMemberLogin", options)
        .then((res) => res.text())
        .then((res) => {
          console.log("GetOrderByMemberLogin res", res);
          parseString(res, (err, result) => {
            if (
              result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table !=
              undefined
            ) {
              result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table.map(
                (item, index) => {
                  console.log(`item ${index}`, item);
                  if (item.DeliveryDate != undefined) {
                    if (
                      (item.DeliveryStatus[0] == "Delivered" ||
                        item.DeliveryStatus[0] == "SMS Delivered") &&
                      item.Status[0] == "Approved"
                    ) {
                      const date = new Date();
                      if (
                        date.getMonth() >= item.DeliveryDate[0].slice(3, 5) ||
                        (date.getMonth() <= item.DeliveryDate[0].slice(3, 5) &&
                          date.getFullYear() >=
                            item.DeliveryDate[0].slice(6, 10))
                      ) {
                        if (
                          date.getDate() - 1 ==
                          item.DeliveryDate[0].slice(0, 2)
                        ) {
                          _that.setState({ showCancel: false });
                        }
                      }
                      if (this.state.deliveryIds.includes(item.OrderID[0])) {
                        return _that.setState({ isVisible: true });
                      }
                    }
                  }
                }
              );
            }
          });
        })
        .catch((err) => {
          this.setState({ error: true, loading: false });
          console.log("err", err);
        });
    }
  };
  componentDidMount = () => {
    this.setModalStatus();
    this._getTotalEarnPoints();
  };
  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this._getTotalEarnPoints()} />
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            marginTop: 15,
            marginBottom: 20,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
              marginRight: 20,
            }}
          >
            <Image
              source={require("../assets/goldCoins.png")}
              style={{
                height: 40,
                width: 40,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: "#000",
                fontWeight: "600",
                alignSelf: "center",
              }}
            >
              {" "}
              Latest points Balance{" "}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#000",
                fontWeight: "600",
                alignSelf: "center",
              }}
            >
              <AnimateNumber
                value={this.state.TotalEarnPoint}
                countBy={50}
                formatter={(val) => {
                  return parseFloat(val).toFixed(0);
                }}
                timing={(interval, progress) => {
                  return 1 * (1 - Math.sin(Math.PI * progress)) * 10;
                }}
              />
            </Text>
          </View>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              borderStyle: "dashed",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#6633cc",
            }}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                try {
                  this.props.navigation.replace("CameraScreen", {
                    dummy: "data111",
                  });
                } catch (err) {
                  console.log("err", err);
                }
              }}
            >
              <Image
                source={require("../assets/camera.png")}
                style={{ height: 120, width: 120, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.context, { marginTop: 10 }]}>
            {" "}
            Scan code on the box
          </Text>
          <Text></Text>
          <Text style={styles.context}>Or</Text>
          <TextInput
            value={this.state.code}
            keyboardType="decimal-pad"
            placeholder="Enter the code"
            placeholderTextColor="#4a4a4a"
            onChangeText={(code) => this.setState({ code: code })}
            style={{
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderBottomWidth: 1,
              borderColor: "#67c2e1",
              alignSelf: "center",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          />
          <TouchableOpacity
            style={{
              height: 40,
              width: 150,
              marginTop: 20,
              backgroundColor: "#6633cc",
              alignSelf: "center",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              this.setState({ modalVisible: true });
              this._onSubmit();
            }}
          >
            <Text style={{ color: "#fff" }}>Submit</Text>
          </TouchableOpacity>
        </View>
        {/* <ApproveModal
          isVisible={this.state.isVisible}
          showCancel={this.state.showCancel}
          navigation={this.props.navigation}
          handleIsVisible={(val) => this.setState({ isVisible: val })}
          description="Please confirm your order received status."
        /> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <ActivityIndicator
              style={{ alignSelf: "center" }}
              size="large"
              color="#0000ff"
            />
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87cefa",
  },
  context: {
    alignSelf: "center",
    textAlign: "center",
  },
});
