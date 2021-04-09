import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  NetInfo,
} from "react-native";

import {
  DrawerActions,
  NavigationActions,
  StackActions,
} from "react-navigation";
import AnimatedProgressWheel from "react-native-progress-wheel";
import MyLabels from "./MyLabels";
import Pie from "react-native-fab-pie";
import AnimateNumber from "react-native-countup";
import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";
import { baseUrlProd, baseUrlProdMiddleware } from "../Constants/production";
import baseUrl from "../Constants/Constants";
import PTRView from "react-native-pull-to-refresh";
import ApproveModal from "../../common/Modal/Modal";
import DeviceInfo from "react-native-device-info";
var parseString = require("xml2js").parseString;
// import 'react-circular-progressbar/dist/styles.css';
let SCREENHEIGHT = Dimensions.get("screen").height;
let SCREENWIDTH = Dimensions.get("screen").width;
const pia = [
  {
    name: "Points Balance",
    population: 1750,
    color: "#00ef9f",
    legendFontColor: "#000",
    legendFontSize: 14,
  },
  {
    name: "Point redeemed",
    population: 2300,
    color: "#ffc7b8",
    legendFontColor: "#000",
    legendFontSize: 14,
  },
  // { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  // { name: 'New York', population: 8538000, color: '#000', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  // { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
];
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientTo: "#08130D",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
};

const MEMBERSHIP_LEVELS = ["Silver", "Gold", "Platinum"];
export default class HomTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pieData: [
        {
          value: "0",
          title: "Points Balance: 0",
          color: "#00ef9f",
          key: "pie-0",
        },
        {
          value: "0",
          title: "Points Redeemed: 0",
          color: "#ffc7b8",
          key: "pie-1",
        },
      ],
      loading: false,
      Balance: "",
      Output: "",
      Membership: "",
      TotalEarnPoint: "",
      modalVisible: false,
      mobile: "",
      password: "",
      TotalSpentPoint: "",
      PointsRequired: "",
      Points: "",
      isVisible: false,
      showCancel: true,
      deliveryIds: [],
    };
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  reRenderComponent = () => {
    this.setModalStatus();
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      // console.log(
      //   "Initial, type: " +
      //     connectionInfo.type +
      //     ", effectiveType: " +
      //     connectionInfo.effectiveType
      // );
    });
    NetInfo.isConnected.fetch().then((isConnected) => {
      // console.log("First, is " + (isConnected ? "online" : "offline"));
    });
    // console.log(
    //   "this.props.navigation",
    //   this.props,
    //   "NavigationActions",
    //   NavigationActions
    // );
    this.pie.current.animate();

    const dbState = getState().data;
    const sess = orm.session(dbState);
    // console.log("sess", sess);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const {
        ChemistCardNo,
        id,
        mobile,
        Balance,
        Output,
        PointsEarned,
        Membership,
        LastTierUpgradeDate,
        DaysRemainingforNextTier,
        TotalEarnPoint,
        Value,
        password,
        TotalSpentPoint,
        PointsRequired,
        Points,
        NextTierLevel,
      } = User.ref;
      // console.log('mobile', mobile);
      this.setState(
        {
          id,
          PointsEarned: PointsEarned,
          LastTierUpgradeDate: LastTierUpgradeDate,
          DaysRemainingforNextTier: DaysRemainingforNextTier,
          Value: Value,
          Balance,
          NextTierLevel: NextTierLevel,
          Output,
          Membership,
          TotalEarnPoint,
          mobile,
          password,
          TotalSpentPoint,
          PointsRequired: parseInt(PointsRequired),
          Points: parseInt(Points),
        },
        () => {
          this.setState({
            pieData: [
              {
                value: parseInt(Balance).toString(),
                title: "Points Balance:  " + parseInt(Balance).toString(),
                color: "#00ef9f",
                key: "pie-0",
              },
              {
                value: parseInt(TotalSpentPoint).toString(),
                title:
                  "Points Redeemed:" + parseInt(TotalSpentPoint).toString(),
                color: "#ffc7b8",
                key: "pie-1",
              },
            ],
            loading: false,
          });
          //   this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible))
        }
      );
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
          // console.log("GetOrderByMemberLogin res", res);
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
                      // console.log(
                      //   "this.state.deliveryIds",
                      //   this.state.deliveryIds
                      // );
                      if (this.state.deliveryIds.includes(item.OrderID[0])) {
                        _that.setState({ isVisible: true });
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
          // console.log("parsedXml", parsedXml);
          if (Object.keys(parsedXml.GetDetailsByTypeResponse).length > 0) {
            if (
              Object.keys(
                parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                  "diffgr:diffgram"
                ]
              ).length === 0
            ) {
              this.setState({ deliveryIds: [...this.state.deliveryIds]});
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
                // console.log("object => ", arr);
                this.setState({
                  deliveryIds: [...new Set([...this.state.deliveryIds, ...arr])],
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
                // console.log("array => ", arr);
                this.setState({
                  deliveryIds: [
                    ...new Set([...this.state.deliveryIds, ...arr]),
                  ],
                });
              }
            }
          }
        })
        .catch((err) => console.log("GetDetailsByType err", err));
    }
  };

  componentDidMount = async () => {
    this.reRenderComponent();
  };

  getMembership = (nextTier) => {
    if (nextTier === "Silver" || nextTier === "Gold")
      return MEMBERSHIP_LEVELS[0];
    return MEMBERSHIP_LEVELS[1];
  };

  getAccountDetails = (chemistCardNo) => {
    const { dispatch } = this.props.navigation;

    const details = {
      // user: "DRL_API",
      // password: "3JA2ASJx^7",
      memberLogin: chemistCardNo,
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
        // console.log("------------GetDefaultAccountByLogin res-----------");
        // console.log(res);
        const parsedRes = JSON.parse(res);
        const newRes = JSON.stringify(parsedRes.data);
        // console.log('newRes', newRes);
        const parsedAlteredNewRes = newRes.slice(30, -2);
        console.log("parsedAlteredNewRes", parsedAlteredNewRes);
        const parsedNewRes = JSON.parse(parsedAlteredNewRes);
        // console.log('------------parsedNewRes--------------');
        console.log("mobile", this.state.mobile);
        // const xml = convert.xml2json(res, {
        //   compact: true,
        //   spaces: 4,
        // });
        // const parsedXml = JSON.parse(xml);
        this.reRenderComponent();
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
        this.setState({
          pieData: [
            {
              value: parseInt(
                parsedNewRes.GetDefaultAccountByLoginResponse
                  .GetDefaultAccountByLoginResult.Value.Balance._text
              ).toString(),
              title:
                "Points Balance:  " +
                parseInt(
                  parsedNewRes.GetDefaultAccountByLoginResponse
                    .GetDefaultAccountByLoginResult.Value.Balance._text
                ).toString(),
              color: "#00ef9f",
              key: "pie-0",
            },
            {
              value: parseInt(
                parsedNewRes.GetDefaultAccountByLoginResponse
                  .GetDefaultAccountByLoginResult.Value.TotalSpentPoint._text
              ).toString(),
              title:
                "Points Redeemed:" +
                parseInt(
                  parsedNewRes.GetDefaultAccountByLoginResponse
                    .GetDefaultAccountByLoginResult.Value.TotalSpentPoint._text
                ).toString(),
              color: "#ffc7b8",
              key: "pie-1",
            },
          ],
          loading: false,
        });
        const User = Object.assign(
          {},
          {
            id: 0,
            mobile: this.state.mobile,
            AccountID:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.AccountID._text,
            AccountTypeID:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.AccountTypeID._text,
            Balance:
              parsedNewRes.GetDefaultAccountByLoginResponse
                .GetDefaultAccountByLoginResult.Value.Balance._text,
            ChemistCardNo: chemistCardNo,
            DaysRemainingforNextTier: this.state.DaysRemainingforNextTier,
            LastTierUpgradeDate: this.state.LastTierUpgradeDate,
            Membership: this.state.Membership,
            NextTierLevel: this.state.NextTierLevel,
            Output: this.state.Output,
            Points: parseInt(this.state.Points),
            PointsEarned: this.state.PointsEarned,
            PointsRequired: parseInt(this.state.PointsRequired),
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
          "Refresh successful",
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
        this.setModalVisible(!this.state.modalVisible);
        alert("GetDefaultAccountByLogin api fail");
        // alert("Something went wrong, please try again!");
      });
    this.setModalVisible(!this.state.modalVisible);
  };

  getUserDashboardDetails = (chemistCardNo) => {
    const details = {
      // user: "DRL_API",
      // password: "3JA2ASJx^7",
      memberLogin: chemistCardNo,
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
        // console.log('parsedNewRes.GetDashboardDetailsOfChemistResponse', parsedNewRes.GetDashboardDetailsOfChemistResponse);
        // console.log('parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult', parsedNewRes.GetDashboardDetailsOfChemistResponse.GetDashboardDetailsOfChemistResult);
        // const xml = convert.xml2json(res, {
        //   compact: true,
        //   spaces: 4,
        // });
        // const parsedXml = JSON.parse(xml);
        // console.log('unparsed xml', parsedXml);

        const memberShip = this.getMembership(
          parsedNewRes.GetDashboardDetailsOfChemistResponse
            .GetDashboardDetailsOfChemistResult.NextTierLevel._text
        );
        // console.log('xml', parsedXml, parsedXml.DashboardDetails.DaysRemainingforNextTier._text);
        this.setState({
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
          Points: parseInt(
            parsedNewRes.GetDashboardDetailsOfChemistResponse
              .GetDashboardDetailsOfChemistResult.PointsEarned._text
          ),
          PointsRequired: parseInt(
            parsedNewRes.GetDashboardDetailsOfChemistResponse
              .GetDashboardDetailsOfChemistResult.PointsRequired._text
          ),
          Value:
            parsedNewRes.GetDashboardDetailsOfChemistResponse
              .GetDashboardDetailsOfChemistResult.Value._text,
          Membership: memberShip,
        });
        this.getAccountDetails(chemistCardNo);
      })
      .catch((err) => {
        console.log("error:", err);
        this.setState({ verifyOtpLoader: false });
        this.setModalVisible({ modalVisible: !this.state.modalVisible });
        alert("GetDashboardDetailsOfChemist api fail");
        // alert("Something went wrong, please try again!");
      });
  };

  _onLogin = async () => {
    this.setState({ loading: true }, () =>
      this.setModalVisible(!this.state.modalVisible)
    );
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const {
        id,
        Balance,
        ChemistCardNo,
        Output,
        Membership,
        TotalEarnPoint,
        password,
        mobile,
        TotalSpentPoint,
      } = User.ref;
      this.setState({
        id,
        Balance,
        Output,
        Membership,
        TotalEarnPoint,
        password,
        mobile,
        TotalSpentPoint,
      });
      console.log("this.state.password", this.state.password);
      this.getUserDashboardDetails(ChemistCardNo);
      // const details = {
      //     'MobileNo': this.state.mobile,
      //     'Password': this.state.password,
      //     'DeviceID': DeviceInfo.getUniqueId(),
      // }
      // const Body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

      // const options = {
      //     method: 'POST',
      //     body: Body,
      //     headers: {
      //         'Accept': 'multipart/form-data',
      //         'Content-Type': 'application/x-www-form-urlencoded'
      //     }
      // };
      // var _that = this;
      // fetch(baseUrlProdMiddleware + '/PrimaLogin', options)
      //     .then(res => res.text())
      //     .then(res => {
      //         console.log('-------------PrimaLogin--------------');
      //         console.log(res);
      //         this.setState({ loading: false }, () => this.setModalVisible(!this.state.modalVisible))
      //         parseString(res, function (err, result) {
      //             if (result.Value.AccountID[0] != 'NA') {
      //                 console.log('result', result.Value, _that.props.navigation);

      //                 _that.setState({
      //                     Balance: result.Value.Balance[0],
      //                     Output: result.Value.Output[0],
      //                     Membership: result.Value.Membership[0],
      //                     TotalEarnPoint: result.Value.TotalEarnPoint[0],
      //                     pieData:[
      //                         {value: parseInt(result.Value.Balance[0]).toString(), title: "Points Balance:  "+parseInt(result.Value.Balance[0]).toString(), color: "#00ef9f", key: "pie-0"},
      //                         {value: parseInt(result.Value.TotalEarnPoint[0]).toString(), title: "Points Redeemed:"+parseInt(result.Value.TotalEarnPoint[0]).toString(), color: "#ffc7b8", key: "pie-1"}
      //                       ],
      //                 })
      //                 _that.setState({
      //                     Points: parseInt(result.Value.Points[0]),
      //                     TotalExpiredPoint: parseInt(result.Value.TotalExpiredPoint[0]),
      //                 })

      //                 const { dispatch } = _that.props.navigation;
      //                 const User = Object.assign({}, {
      //                     id: 0,
      //                     AccountID: result.Value.AccountID[0],
      //                     AccountTypeID: result.Value.AccountTypeID[0],
      //                     Balance: result.Value.Balance[0],
      //                     ChemistCardNo: result.Value.ChemistCardNo[0],
      //                     DaysRemainingforNextTier: result.Value.DaysRemainingforNextTier[0],
      //                     LastTierUpgradeDate: result.Value.LastTierUpgradeDate[0],
      //                     Membership: result.Value.Membership[0],
      //                     NextTierLevel: result.Value.NextTierLevel[0],
      //                     Output: result.Value.Output[0],
      //                     Points: result.Value.Points[0],
      //                     PointsEarned: result.Value.PointsEarned[0],
      //                     PointsRequired: result.Value.PointsRequired[0],
      //                     TotalEarnPoint: result.Value.TotalEarnPoint[0],
      //                     TotalExpiredPoint: result.Value.TotalExpiredPoint[0],
      //                     TotalSpentPoint: result.Value.TotalSpentPoint[0],
      //                     UpdatedBy: result.Value.UpdatedBy[0],
      //                     UpdatedOn: result.Value.UpdatedOn[0],
      //                     CreatedBy: result.Value.CreatedBy[0],
      //                 });
      //                 dispatch({
      //                     type: ActionTypes.USER_DATA,
      //                     User
      //                 });
      //                 Alert.alert(
      //                     'Prime Partner',
      //                     'Refreshed successfully',
      //                     [
      //                         { text: 'OK', onPress: () => console.log('OK Pressed') },
      //                     ],
      //                     { cancelable: false },
      //                 );
      //                 const dbState = getState().data;
      //                 const sess = orm.session(dbState);
      //                 console.log("sess", sess);
      //             } else {
      //                 Alert.alert(
      //                     'Prime Partner',
      //                     result.Value.ChemistCardNo[0],
      //                     [
      //                         { text: 'OK', onPress: () => console.log('OK Pressed') },
      //                     ],
      //                     { cancelable: false },
      //                 );
      //                 // alert(result.Value.ChemistCardNo[0])
      //                 // this.setModalVisible(!this.state.modalVisible);
      //             }
      //         });
      //     })
      //     .catch((err => console.log("err", err)))
    }
  };
  _refresh = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._onLogin();
        resolve();
      }, 800);
    });
  };
  pie = React.createRef();

  render() {
    console.log("this.state", this.state);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <PTRView onRefresh={this._refresh}>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                margin: 20,
                width: SCREENWIDTH - 20,
                borderWidth: 0,
                backgroundColor: "#6633cc",
                borderRadius: 10,
              }}
            >
              {/* <TouchableOpacity style={{ borderWidth: 0, width: '33.3%', height: 40, flexDirection: 'row', justifyContent:'center', borderTopLeftRadius:10, borderBottomLeftRadius:10}}
                        onPress={() => this.props.navigation.navigate('EarnPointsTab')}
                        >
                            <Image
                                source={(require('../assets/Icons-03.png'))}
                                style={{ height: 25, width: 25, resizeMode: "contain", alignSelf:'center' }}
                            />
                            <Text style={{color:'#fff', alignSelf:'center', margin:2}}>Earn Points</Text>
                        </TouchableOpacity> */}
              <TouchableOpacity
                style={{
                  borderWidth: 0,
                  width: "50%",
                  height: 40,
                  flexDirection: "row",
                  justifyContent: "center",
                  borderRightWidth: 1,
                  borderColor: "#fff",
                }}
                onPress={() => this.props.navigation.navigate("Trend")}
              >
                <Image
                  source={require("../assets/Icons-04.png")}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />
                <Text style={{ color: "#fff", alignSelf: "center", margin: 5 }}>
                  Trend
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 0,
                  width: "50%",
                  height: 40,
                  flexDirection: "row",
                  justifyContent: "center",
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                onPress={() =>
                  this.props.navigation.navigate("RewardCatalogue")
                }
              >
                <Image
                  source={require("../assets/Icons-06.png")}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />
                <Text style={{ color: "#fff", alignSelf: "center", margin: 0 }}>
                  Redeem Gifts
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View
                style={{
                  height: SCREENHEIGHT * 0.7,
                  backgroundColor: "#fff",
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    height: SCREENHEIGHT * 0.2,
                    borderWidth: 0,
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{ height: "100%", width: "50%", borderWidth: 0 }}
                  >
                    {this.state.Membership === "Gold" && (
                      <Image
                        source={require("../assets/Gold.png")}
                        style={{
                          resizeMode: "contain",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )}
                    {this.state.Membership === "Silver" && (
                      <Image
                        source={require("../assets/Silver.png")}
                        style={{
                          resizeMode: "contain",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )}
                    {this.state.Membership === "Platinum" && (
                      <Image
                        source={require("../assets/Platinum.png")}
                        style={{
                          resizeMode: "contain",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      height: "100%",
                      width: "50%",
                      borderWidth: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 0,
                    }}
                  >
                    <AnimatedProgressWheel
                      size={SCREENWIDTH / 3.5}
                      width={5}
                      duration={1000}
                      animateFromValue={-1}
                      color={"#000"}
                      progress={
                        parseInt(this.state.PointsRequired) === 0
                          ? 100
                          : this.state.Membership === "Gold"
                          ? parseInt(
                              (parseInt(this.state.Points) /
                                parseInt(this.state.PointsRequired)) *
                                100
                            )
                          : this.state.Membership === "Silver"
                          ? parseInt(
                              (parseInt(this.state.Points) /
                                parseInt(this.state.PointsRequired)) *
                                100
                            )
                          : 100
                      }
                      backgroundColor={"#ffd766"}
                    />
                    {this.state.PointsRequired === 0 ? (
                      <Text
                        style={{
                          color: "#000",
                          position: "absolute",
                          fontSize: 18,
                        }}
                      >
                        100%
                      </Text>
                    ) : this.state.Membership === "Platinum" ? (
                      <Text
                        style={{
                          color: "#000",
                          position: "absolute",
                          fontSize: 18,
                        }}
                      >
                        {parseInt((this.state.Points / 2500) * 100)}%
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: "#000",
                          position: "absolute",
                          fontSize: 18,
                        }}
                      >
                        {parseInt(
                          (this.state.Points / this.state.PointsRequired) * 100
                        )}
                        %
                      </Text>
                    )}
                    {/* <Text style={{color:'#000',position:'absolute', fontSize:18}}>{parseInt(this.state.PointsRequired)}%</Text> */}
                  </View>
                </View>
                <View style={{ paddingBottom: 20 }}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: 12,
                      textAlign: "center",
                      letterSpacing: 0.8,
                      color: "#000",
                    }}
                  >
                    {this.state.Output}
                  </Text>
                </View>
                {/* <View
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    borderStyle: "dashed",
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#6633cc",
                  }}
                >
                  <View 
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      top: 0,
                      backgroundColor: '#fff',
                      height: 1,
                      left: 0,
                      right: 0,
                      alignSelf: 'center',
                      width: '100%',
                    }}
                  />
                </View> */}
                <View style={{ height: SCREENHEIGHT * 0.3 }}>
                  <Text
                    style={{
                      alignSelf: "center",
                      textAlign: "center",
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#000",
                      margin: 10,
                    }}
                  >
                    {" "}
                    Total Points Earned{" "}
                  </Text>
                  <View
                    style={{
                      borderWidth: 0,
                      height: SCREENHEIGHT * 0.3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <PieChart
                          style={{elevation:5}}
                          data={pia}
                          width={SCREENWIDTH}
                          height={SCREENHEIGHT*0.3}
                          chartConfig={chartConfig}
                          accessor="population"
                          backgroundColor="transparent"
                          paddingLeft="0"
                          absolute
                        />    
                    */}
                    <Pie
                      ref={this.pie}
                      containerStyle={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 0,
                      }}
                      pieStyle={{
                        width: 200,
                        height: 200,
                        flex: 1,
                      }}
                      outerRadius={80}
                      innerRadius={0.1}
                      data={this.state.pieData}
                      animate
                    >
                      <MyLabels />
                    </Pie>
                  </View>

                  <Text
                    style={{ color: "#000", alignSelf: "center", fontSize: 16 }}
                  >
                    Point Balance:{" "}
                    <AnimateNumber
                      value={this.state.Balance}
                      countBy={50}
                      formatter={(val) => {
                        return parseFloat(val).toFixed(0);
                      }}
                      timing={(interval, progress) => {
                        // slow start, slow end
                        return 1 * (1 - Math.sin(Math.PI * progress)) * 10;
                      }}
                    />
                  </Text>
                  {/* <AnimateNumber value={100} timing="linear"/> */}

                  {/* <AnimateNumber value={100} timing="easeIn"/> */}
                </View>
              </View>
            </ScrollView>
            {/* <ApproveModal
              isVisible={this.state.isVisible}
              showCancel={this.state.showCancel}
              navigation={this.props.navigation}
              handleIsVisible={(val) => {
                this.setState({ isVisible: val });
              }}
              description="Please confirm your order received status."
            /> */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
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
          </PTRView>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87cefa",
    // justifyContent:'center',
  },
  context: {
    alignSelf: "center",
    textAlign: "center",
  },
  spinner: {
    alignSelf: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
