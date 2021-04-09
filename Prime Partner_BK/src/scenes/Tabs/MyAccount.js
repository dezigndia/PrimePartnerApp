import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createAppContainer,
  createDrawerNavigator,
  NavigationEvents,
} from "react-navigation";

let SCREENWIDTH = Dimensions.get("screen").width;
let SCREENHEIGHT = Dimensions.get("screen").height;
import AnimateNumber from "react-native-countup";
import baseUrl from "../Constants/Constants";
import { baseUrlProdMiddleware } from "../Constants/production";
// import baseUrl from '../Constants/production';

import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";
var parseString = require("xml2js").parseString;
sampleData = [
  {
    Address1: "SURYAKANTRAO JOSHI",
    Address2: "SURVEY NO.-192/5 , NEAR SAI LAWN ,NEAR S.B.O.A. SCHOOL,",
    Address3: "DEOGIRI ABHIJIT B-2,NEAR KRUSHNA MANGAL",
    CardNumber: "23300056",
    CityName: "Aurangabad",
    GiftRequiredPoints: "4000.0000",
    ImageURL:
      "http://drlprimepartner.accentivrewards.in/images/gifts/EGV1165.jpg",
    ItemName: "Amazon E-Gift Voucher Rs 2000/-",
    Itemcode: "EGV1165",
    OrderDate: "08/12/2017",
    OrderID: "33474",
    OrderReference: "7E1CR-1D-82C2",
    Pincode: "431001",
    Quantity: "1",
    ReceiveStatus: "Not Received",
    StateName: "Maharashtra",
    Status: "Approved",
  },
  {
    Address1: "SURYAKANTRAO JOSHI",
    Address2: "SURVEY NO.-192/5 , NEAR SAI LAWN ,NEAR S.B.O.A. SCHOOL,",
    Address3: "DEOGIRI ABHIJIT B-2,NEAR KRUSHNA MANGAL",
    CardNumber: "23300056",
    CityName: "Aurangabad",
    GiftRequiredPoints: "150.0000",
    ImageURL:
      "http://drlprimepartner.accentivrewards.in/images/gifts/IT4546.jpg",
    ItemName: "ITTest",
    Itemcode: "IT4546",
    OrderDate: "14/02/2017",
    OrderID: "33469",
    OrderReference: "7E12R-1D-82BD",
    Pincode: "431001",
    Quantity: "1",
    ReceiveStatus: "Not Received",
    StateName: "Maharashtra",
    Status: "Rejected",
  },
];

class redeemPointHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      noData: false,
      totalEarnPoint: null,
      Balance: null,
      redeemedPoint: null,
    };
  }

  reRenderComponent = () => {
    const dbState = getState().data;
    const sess = orm.session(dbState);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const {
        id,
        ChemistCardNo,
        TotalEarnPoint,
        Balance,
        TotalSpentPoint,
      } = User.ref;
      this.setState({
        MemberLogin: ChemistCardNo,
        totalEarnPoint: TotalEarnPoint,
        Balance: Balance,
        redeemedPoint: TotalSpentPoint,
      });
      const details = {
        MemberLogin: ChemistCardNo,
        // 'MemberLogin': '23300056',
        // 'MemberLogin': '23300027',
        // 'MemberLogin': '23300020',
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
      let data = [];
      _that = this;
      fetch(baseUrlProdMiddleware + "/GetOrderByMemberLogin", options)
        .then((res) => res.text())
        .then((res) => {
          console.log("GetOrderByMemberLogin res", res);
          parseString(res, async (err, result) => {
            if (
              result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table !=
              undefined
            ) {
              console.log(
                "(result.DataSet['diffgr:diffgram']",
                result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table
              );
              result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table.map(
                (item, index) => {
                  let obb = {
                    // Address1:item.Address1[0],
                    // Address2: item.Address2[0],
                    // Address3: item.Address3[0],
                    CardNumber: item.CardNumber[0],
                    CityName: item.CityName[0],
                    GiftRequiredPoints: item.GiftRequiredPoints[0],
                    ImageURL: item.ImageURL[0],
                    ItemName: item.ItemName[0],
                    Itemcode: item.Itemcode[0],
                    OrderDate: item.OrderDate[0],
                    OrderID: item.OrderID[0],
                    OrderReference: item.OrderReference[0],
                    Pincode: item.Pincode[0],
                    Quantity: item.Quantity[0],
                    ReceiveStatus: item.ReceiveStatus[0],
                    StateName: item.StateName[0],
                    Status: item.Status[0],
                  };
                  data.push(obb);
                }
              );
              console.log(data);
              _that.setState({ data: data, loading: false });
            } else {
              _that.setState({ loading: false, noData: true });
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
    this.reRenderComponent();
  };
  renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          borderBottomWidth: 0.5,
          borderColor: "#4a4a4a",
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Text
            numberOfLines={0.5}
            ellipsizeMode="tail"
            style={{
              color: "#000",
              fontSize: 16,
              fontWeight: "600",
              flexWrap: "wrap",
            }}
          >
            {" "}
            {item.ItemName}
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              letterSpacing: 0.8,
              fontWeight: "600",
            }}
          >
            {parseInt(item.GiftRequiredPoints)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Text style={{ width: "70%", fontSize: 16, letterSpacing: 0.8 }}>
            {item.OrderReference}
          </Text>
          <Text style={{ fontSize: 16, letterSpacing: 0.8 }}>
            {item.OrderDate}
          </Text>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container1}>
        <NavigationEvents onDidFocus={() => this.reRenderComponent()} />
        {!this.state.loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {!this.state.noData ? (
              <FlatList
                data={this.state.data}
                extraData={this.state.data}
                renderItem={this.renderItem}
              />
            ) : (
              <Text style={{ alignSelf: "center" }}>No History Found.</Text>
            )}
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#6633cc" />
          </View>
        )}
      </View>
    );
  }
}

class PointHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Points: "",
      SKUName: "",
      TransactionDate: "",
      VoucherCode: "",
      MobileNumber: "",
      TransactionID: "",
      loading: true,
      data: null,
    };
  }

  reRenderComponent = () => {
    const dbState = getState().data;
    const sess = orm.session(dbState);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const {
        id,
        ChemistCardNo,
        TotalEarnPoint,
        Balance,
        TotalSpentPoint,
      } = User.ref;
      this.setState({
        MemberLogin: ChemistCardNo,
        totalEarnPoint: TotalEarnPoint,
        Balance: Balance,
        redeemedPoint: TotalSpentPoint,
      });
      console.log("ChemistCardNo --- Point History", ChemistCardNo);
      const details = {
        MemberLogin: ChemistCardNo,
        FromIndex: "0",
        ToIndex: "1000",
        // 'MemberLogin': '23300020',
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
      let data = [];
      _that = this;
      fetch(baseUrlProdMiddleware + "/GetTransactionList", options)
        .then((res) => res.text())
        .then((res) => {
          parseString(res, async (err, result) => {
            console.log(
              "(result.DataSet['diffgr:diffgram']",
              result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table
            );
            if (
              result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table !=
              undefined
            ) {
              result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table.map(
                (item, index) => {
                  let obb = {
                    MobileNumber: item.MobileNumber[0],
                    Points: item.Points[0],
                    SKUName: item.SKUName[0],
                    TransactionDate: item.TransactionDate[0],
                    TransactionID: item.TransactionID[0],
                    VoucherCode: item.VoucherCode[0],
                  };
                  data.push(obb);
                }
              );
              console.log(data);
              _that.setState({ data: data, loading: false });
            } else {
              _that.setState({ loading: false, noData: true });
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
    this.reRenderComponent();
  };
  renderItem = ({ item }) => {
    return (
      <View style={{ borderBottomWidth: 0.5 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 5,
            paddingTop: 5,
          }}
        >
          <View style={{ borderWidth: 0, width: "85%" }}>
            <Text
              numberOfLines={0}
              ellipsizeMode={"tail"}
              style={{ fontSize: 16, fontWeight: "200", color: "#000" }}
            >
              {item.SKUName}
            </Text>
          </View>
          <View style={{ borderWidth: 0, width: "15%" }}>
            <Text
              numberOfLines={0}
              ellipsizeMode={"tail"}
              style={{ fontSize: 16, fontWeight: "200", color: "#000" }}
            >
              {item.Points}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 2,
            paddingTop: 2,
          }}
        >
          <View>
            <Text
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={{ fontSize: 16 }}
            >
              {item.VoucherCode}
            </Text>
          </View>
          <View>
            {/* <Text style={{fontSize:16, }}>{new Date(item.TransactionDate).getDate()}/{new Date(item.TransactionDate).getMonth()}/{new Date(item.TransactionDate).getFullYear()}: {new Date(item.TransactionDate).getHours()}: {new Date(item.TransactionDate).getMinutes()}</Text> */}
            <Text
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={{ fontSize: 16 }}
            >
              {item.TransactionDate}
            </Text>
          </View>
        </View>
        {/* <Text>{item.key}</Text> */}
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container1}>
        <NavigationEvents onDidFocus={() => this.reRenderComponent()} />
        {!this.state.loading ? (
          <FlatList
            data={this.state.data}
            extraData={this.state.data}
            // data={[{key: 'a'}, {key: 'b'}]}
            renderItem={this.renderItem}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#6633cc" />
          </View>
        )}
        {/* <Text style={styles.context}> Under Maintenance </Text> */}
      </View>
    );
  }
}
const PointHistory1 = createStackNavigator(
  {
    PointHistory: {
      title: "Point History",
      screen: PointHistory,
    },
  },
  {
    headerMode: "none",
  }
);
const redeemPointHistory1 = createStackNavigator(
  {
    redeemPointHistory: {
      title: "Redeem Point History",
      screen: redeemPointHistory,
    },
  },
  {
    headerMode: "none",
  }
);
const Tabs = createAppContainer(
  createMaterialTopTabNavigator(
    {
      PointHistory: {
        title: "Point History",
        screen: PointHistory1,
      },
      redeemPointHistory: {
        title: "Redeem Point History",
        screen: redeemPointHistory1,
      },
    },
    {
      initialRouteName: "PointHistory",
      animationEnabled: true,
      tabBarOptions: {
        showLabel: true,
        activeTintColor: "#522e90",
        upperCaseLabel: true,

        style: {
          backgroundColor: "transparent",
          height: 40,
        },
        indicatorStyle: {
          style: {
            color: "#522e90",
          },
        },
      },
      lazy: true,
    }
  )
);
export default class MyAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const {
        id,
        ChemistCardNo,
        TotalEarnPoint,
        Balance,
        TotalSpentPoint,
      } = User.ref;
      this.setState({
        MemberLogin: ChemistCardNo,
        totalEarnPoint: parseInt(TotalEarnPoint),
        Balance: parseInt(Balance),
        redeemedPoint: parseInt(TotalSpentPoint),
      });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            margin: 20,
            backgroundColor: "#fff",
            borderRadius: 5,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderWidth: 0,
              height: SCREENHEIGHT * 0.08,
              padding: 20,
            }}
          >
            <Image
              source={require("../assets/goldCoins.png")}
              style={{
                height: 60,
                width: 60,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                color: "#000",
                fontSize: 18,
                fontWeight: "600",
                alignSelf: "center",
              }}
            >
              Latest Points Balance
            </Text>
          </View>
          <View>
            <Text
              style={{
                alignSelf: "center",
                marginRight: 20,
                fontSize: 24,
                fontWeight: "500",
                color: "#000",
              }}
            >
              <AnimateNumber
                value={this.state.Balance}
                countBy={100}
                formatter={(val) => {
                  return parseFloat(val).toFixed(0);
                }}
                timing={(interval, progress) => {
                  // slow start, slow end
                  return 1 * (1 - Math.sin(Math.PI * progress)) * 10;
                }}
              />
            </Text>
            <Text style={{ alignSelf: "center", fontSize: 14 }}>
              Buy More, Earn More !
            </Text>
            <Text style={{ alignSelf: "center", fontSize: 14, color: "#000" }}>
              Points are valid for 1 year from their date of earning
            </Text>
          </View>
          <View
            style={{
              height: 1,
              borderWidth: 0.5,
              borderStyle: "dashed",
              borderRadius: 2,
              marginLeft: 10,
              marginRight: 10,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              borderWidth: 0,
              height: SCREENHEIGHT * 0.12,
            }}
          >
            <View
              style={{
                width: "50%",
                height: "100%",
                borderWidth: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ alignSelf: "center", fontSize: 18, color: "#000" }}
              >
                {this.state.totalEarnPoint}
              </Text>
              <Text
                style={{ alignSelf: "center", fontSize: 12, color: "#000" }}
              >
                Total Points Earned
              </Text>
            </View>
            <View
              style={{
                width: "50%",
                height: "100%",
                borderWidth: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ alignSelf: "center", fontSize: 18, color: "#000" }}
              >
                {this.state.redeemedPoint}
              </Text>
              <Text
                style={{ alignSelf: "center", fontSize: 12, color: "#000" }}
              >
                Redeemed Points
              </Text>
            </View>
          </View>
        </View>
        <Tabs props={this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87cefa",
    // justifyContent:'center'
  },
  container1: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  context: {
    alignSelf: "center",
    textAlign: "center",
  },
});
