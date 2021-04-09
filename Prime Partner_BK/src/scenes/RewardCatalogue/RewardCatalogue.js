import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
let SCREENWIDTH = Dimensions.get("screen").width;
let SCREENHEIGHT = Dimensions.get("screen").height;
import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";
import { baseUrlProdMiddleware, baseUrlProd } from "../Constants/production";
var parseString = require("xml2js").parseString;
import { NavigationEvents } from "react-navigation";
import ApproveModal from "../../common/Modal/Modal";

// const sampleData=[
//     {
//         CatalogCategoryID: "92",
//         GiftReference: "PP0583",
//         ImageURL: "https://www.drlprimepartner.com/images/gifts/PP0583.jpg",
//         IsPremium: "",
//         Itemname: "Bajaj  Customise Two Wheeler Gift Voucher Rs.40000/-",
//         Points: "85000.0000",
//     },
//     {
//         CatalogCategoryID: "92",
//         GiftReference: "PP2338",
//         ImageURL: "https://www.drlprimepartner.com/images/gifts/PP2338.jpg",
//         IsPremium: "",
//         Itemname: "TVS Gift Voucher Rs 40000/-",
//         Points: "81000.0000",
//     },
// ]
export default class RewardCatalogue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      CatalogCategoryID: "",
      GiftReference: "",
      ImageURL: "",
      IsPremium: "",
      Itemname: "",
      Points: "",
      loading: true,
      data: null,
      isVisible: false,
      showCancel: true,
      deliveryIds: [],
    };
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

  componentDidMount() {
    this.setModalStatus();
    this._getTotalEarnPoints();
    console.log("componentDidMount");
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    this._rewardCatalogueData();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate("HomeTABS");
    // this.goBack(); // works best when the goBack is async
    return true;
  };
  _rewardCatalogueData = () => {
    this.setState({
      loading: true,
    });
    let data = [];
    _that = this;
    try {
      const dbState = getState().data;
      const sess = orm.session(dbState);
      console.log("sess", sess);
      // alert(ID)
      // if (sess.User.idExists(0)) {
      //   const User = sess.User.withId(0);
      //   const { id, ChemistCardNo} = User.ref;
      const details = {
        CategoryID: "0",
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
      fetch(baseUrlProdMiddleware + "/GetGiftsbyCategoryID", options)
        .then((res) => res.text())
        .then((res) => {
          // console.log("res:", res);
          parseString(res, async (err, result) => {
            //    console.log("result", result);
            //    console.log("(result.DataSet['diffgr:diffgram']",result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table);

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
                  let obj = {
                    CatalogCategoryID: item.CatalogCategoryID[0],
                    GiftReference: item.GiftReference[0],
                    ImageURL: item.ImageURL[0],
                    IsPremium: item.IsPremium[0],
                    Itemname: item.Itemname[0],
                    Points: item.Points[0],
                  };
                  data.push(obj);
                }
              );
              _that.setState({
                data: data,
                loading: false,
              });
              _that.setState({
                loading: false,
              });
              console.log(data);
            }
          });
        });
      // }
    } catch (er) {
      console.log("er", er);
    }
  };

  _onDidFocus = () => {
    this.setModalStatus();
    this._getTotalEarnPoints();
    if (this.props.navigation.state.params != undefined) {
      if (this.props.navigation.state.params.VerifyRedeemtionOTP) {
        this._rewardCatalogueData();
      }
      console.log("");
    }
  };

  renderItem = ({ item }) => {
    return (
      <View style={{ borderBottomWidth: 0.5, padding: 5 }}>
        <View style={{ justifyContent: "center", margin: 10 }}>
          <ImageBackground
            source={require("../assets/band.png")}
            style={{ height: 30, width: 150, alignSelf: "center" }}
          >
            <Text
              style={{
                color: "#fff",
                position: "absolute",
                fontSize: 14,
                alignSelf: "center",
                marginBottom: 50,
              }}
            >
              {parseInt(item.Points)} Points
            </Text>
          </ImageBackground>
        </View>
        <View style={{ margin: 10, borderWidth: 0, borderWidth: 0 }}>
          <Image
            source={{ uri: item.ImageURL }}
            style={{ height: 100, width: 100, alignSelf: "center" }}
            borderWidth={50}
            opacity={10}
          />
        </View>
        <View style={{ justifyContent: "center", margin: 10 }}>
          <Text
            style={{
              textAlign: "center",
              color: "#673fbe",
              fontSize: 16,
              alignSelf: "center",
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            {item.Itemname}
          </Text>
          <Text style={{ color: "#000", textAlign: "center", margin: 5 }}>
            Code :{item.GiftReference}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 0,
          }}
        >
          <TouchableOpacity
            style={{
              width: 150,
              borderRadius: 3,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#DC9121",
            }}
            onPress={() => {
              this.props.navigation.navigate("RedemptionConfirmation", {
                GiftReference: item.GiftReference,
                Points: item.Points,
                Itemname: item.Itemname,
                ImageURL: item.ImageURL,
              });
            }}
          >
            <Text style={{ color: "#000", fontWeight: "600" }}>REDEEM</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this._onDidFocus()} />
        <View style={styles.headerView}>
          <Entypo
            name="home"
            size={30}
            color="#fff"
            style={{ alignSelf: "center" }}
            onPress={() => this.props.navigation.navigate("HomeTABS")}
          />
          <Text style={{ color: "#fff", alignSelf: "center", fontSize: 18 }}>
            Reward Catalogue
          </Text>
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={() => this.props.navigation.navigate("CatalogueHistory")}
          >
            <Image
              source={require("../assets/history.png")}
              style={{
                width: 35,
                height: 35,
                resizeMode: "contain",
                paddingRight: 0,
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 10,
            color: "#000",
            marginLeft: 10,
            marginRight: 10,
            fontWeight: "600",
          }}
        >
          Pictures used in the Catalogue are for representation purpose only.
          Actual products & their colors/ models may vary and subject to
          availability.
        </Text>

        {!this.state.loading ? (
          <FlatList data={this.state.data} renderItem={this.renderItem} />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#6633cc" />
          </View>
        )}

        {/* <ApproveModal
          isVisible={this.state.isVisible}
          showCancel={this.state.showCancel}
          navigation={this.props.navigation}
          handleIsVisible={(val) => this.setState({ isVisible: val })}
          description="Please confirm your order received status."
        /> */}

        {/* <Text style={styles.context}> RewardCatalogue </Text> */}
      </View>
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
  headerView: {
    height: SCREENHEIGHT * 0.06,
    backgroundColor: "#6633cc",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
