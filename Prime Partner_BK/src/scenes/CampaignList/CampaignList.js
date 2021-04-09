import React, { useEffect } from "react";
import {
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import orm from "src/data";
import { DrawerActions, NavigationAction } from "react-navigation";
import { baseUrlProd } from "../Constants/production";
import { getState } from "src/storeHelper";
import Entypo from "react-native-vector-icons/Entypo";

const convert = require("xml-js");
let SCREENHEIGHT = Dimensions.get("screen").height;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const CampaignList = ({ navigation }) => {
  const [campaignList, setCampaignList] = React.useState([]);
  const [toggleIndicator, setToggleIndicator] = React.useState(false);

  useEffect(() => {
    const campaign_list = [];
    const dbState = getState().data;
    const sess = orm.session(dbState);
    const User = sess.User.withId(0);
    const { AccountID } = User.ref;

    const detailsForCampDetails = {
      // user: "DRL_API",
      // password: "3JA2ASJx^7",
      memberId: AccountID,
      type: "CampaignDetails",
    };
    console.log("detailsForCampDetails", { detailsForCampDetails });
    const detailsForCampImages = {
      // user: "DRL_API",
      // password: "3JA2ASJx^7",
      memberId: AccountID,
      type: "ShowCampaignImages",
    };

    const Body = Object.keys(detailsForCampDetails)
      .map(
        (key) =>
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(detailsForCampDetails[key])
      )
      .join("&");

    const newBody = Object.keys(detailsForCampImages)
      .map(
        (key) =>
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(detailsForCampImages[key])
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

    const newOptions = {
      method: "POST",
      body: newBody,
      headers: {
        Accept: "multipart/form-data",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const campaignObjDetails = [];

    fetch(baseUrlProd + "/GetDetailsByType", options)
      .then((res) => res.text())
      .then((res) => {
        // console.log("GetDetailsByType res", res);
        const parsedRes = JSON.parse(res);
        const newRes = JSON.stringify(parsedRes.data);
        // console.log('newRes', newRes);
        const parsedAlteredNewRes = newRes.slice(30, -2);
        // console.log('parsedAlteredNewRes', parsedAlteredNewRes);
        const parsedXml = JSON.parse(parsedAlteredNewRes);
        // console.log("parsedXml", parsedXml);
        // console.log("parsedXml.GetDetailsByTypeResponse", parsedXml.GetDetailsByTypeResponse);
        // console.log("parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult", parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult);
        // console.log("parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult.diffgr:diffgram", parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult['diffgr:diffgram']);
        if (
          Object.keys(
            parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
              "diffgr:diffgram"
            ]
          ).length === 0
        ) {
          // console.log('------------------in----------------');
          // console.log('response', Object.keys(parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult["diffgr:diffgram"]));
          // console.log('length', Object.keys(parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult["diffgr:diffgram"]).length);
          setToggleIndicator(true);
          return;
        }

        if (
          Array.isArray(
            parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
              "diffgr:diffgram"
            ].NewDataSet.Table
          )
        ) {
          parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
            "diffgr:diffgram"
          ].NewDataSet.Table.map((item) => campaignObjDetails.push(item));
          // campaignObjDetails.push(parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult['diffgr:diffgram'].NewDataSet.Table);
        } else {
          campaignObjDetails.push(
            parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
              "diffgr:diffgram"
            ].NewDataSet.Table
          );
        }

        console.log("campaignObjDetails", campaignObjDetails);

        const campaignObjImages = [];

        fetch(baseUrlProd + "/GetDetailsByType", newOptions)
          .then((res) => res.text())
          .then((res) => {
            // console.log('GetDetailsByType---Images', res)
            const parsedRes = JSON.parse(res);
            const newRes = JSON.stringify(parsedRes.data);
            // console.log('newRes', newRes);
            const parsedAlteredNewRes = newRes.slice(30, -2);
            // console.log('parsedAlteredNewRes', parsedAlteredNewRes);
            const parsedXml = JSON.parse(parsedAlteredNewRes);
            // const parsedXml = JSON.parse(xml);
            // if (!parsedXml.DataSet) {
            //   setToggleIndicator(true);
            //   return;
            // }
            // console.log('parsedXml', parsedXml);
            if (
              Object.keys(
                parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                  "diffgr:diffgram"
                ]
              ).length === 0
            ) {
              // console.log('------------------in----------------');
              // console.log('response', Object.keys(parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult["diffgr:diffgram"]));
              // console.log('length', Object.keys(parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult["diffgr:diffgram"]).length);
              campaignObjImages.push({
                ImageURL: {_text: "NA"},
                Bonus: {_text: "NA"},
                Status: {_text: "NA"},
              });
              setToggleIndicator(true);
            } else if (
              Array.isArray(
                parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                  "diffgr:diffgram"
                ].NewDataSet.Table
              )
            ) {
              parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                "diffgr:diffgram"
              ].NewDataSet.Table.map((item) => campaignObjImages.push(item));
              // campaignObjDetails.push(parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult['diffgr:diffgram'].NewDataSet.Table);
            } else {
              campaignObjImages.push(
                parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult[
                  "diffgr:diffgram"
                ].NewDataSet.Table
              );
            }
            // if (
            //   Array.isArray(
            //     parsedXml.GetDetailsByTypeResponse.GetDetailsByTypeResult["diffgr:diffgram"].NewDataSet.Table
            //   )
            // ) {
            //   parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table.map(
            //     (item, index) => {
            //       let obj = {};
            //       delete item._attributes;
            //       obj = item;
            //       campaignObjImages.push(obj);
            //     }
            //   );
            // } else {
            //   campaignObjImages.push(
            //     parsedXml.DataSet["diffgr:diffgram"].NewDataSet.Table
            //   );
            // }

            // if (campaignObjImages[0].ImageURL === "NA") {
            //   setCampaignList(
            //     Object.assign(campaignObjDetails, campaignObjImages)
            //   );
            //   return;
            // }

            campaignObjDetails.map((campDetails, campDetailsIndex) => {
              console.log("campDetails", campDetails);
              console.log("campDetails.ID", campDetails.CampaignID);
              console.log("campDetails.ID._tetx", campDetails.CampaignID._text);
              // const {
              //   CampaignID: { _text },
              // } = campDetails;
              // if (
              //   _text ===
              //   (campaignObjImages[campDetailsIndex] &&
              //     campaignObjImages[campDetailsIndex].CampaignID._text)
              // ) {
              Object.assign(campDetails, campaignObjImages[campDetailsIndex]);
              campaign_list.push(campDetails);
              setCampaignList(campaign_list);
              // }
            });
          })
          .catch((err) => {
            setToggleIndicator(true);
            console.log("err B", err.message);
            // alert("Failed to fetch campaign image!");
          })
          .finally(() => {
            if (campaignList === []) {
              setToggleIndicator(true);
            }
          });
      })
      .catch((err) => {
        setToggleIndicator(true);
        console.log("err A", err.message);
        // alert("Failed to fetch campaign details!");
      })
      .finally(() => {
        if (campaignList === []) {
          setToggleIndicator(true);
        }
      });
  }, []);

  const getDate = (startDate) => {
    let date = new Date(`${startDate}`);
    let fullDate;
    fullDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return fullDate;
  };

  return (
    <>
      <StatusBar backgroundColor="#522e90" barStyle="light-content" />
      <View style={styles.headerView}>
        <TouchableOpacity
          style={{ alignSelf: "center" }}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Entypo
            name="menu"
            size={24}
            color="#fff"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
        <Text style={{ color: "#fff", alignSelf: "center", fontSize: 18 }}>
          Campaign
        </Text>
        <TouchableOpacity></TouchableOpacity>
      </View>
      {campaignList.length > 0 ? (
        <ScrollView style={styles.container}>
          {campaignList.map((item, index) => {
            const {
              CampaignID,
              CampaignName,
              CampaignDescription,
              StartDate,
              EndDate,
              Bonus,
              ImageURL,
              Status,
            } = item;
            return (
              <View key={CampaignID._text} style={styles.card}>
                <Text style={styles.campName}>{CampaignName._text}</Text>
                <Text style={styles.campDesc}>{CampaignDescription._text}</Text>
                <Text style={styles.campDetails}>
                  From: {getDate(StartDate._text)}
                </Text>
                <Text style={styles.campDetails}>
                  To: {getDate(EndDate._text)}
                </Text>
                <Text style={styles.campDetails}>
                  Bonus: {Bonus ? Bonus._text : "NA"}
                </Text>
                <Text style={styles.campDetails}>
                  Image:{" "}
                  <Text
                    style={[styles.imageLink, ImageURL._text === "NA" ? {color: 'gray', fontWeight: "100"} : {}]}
                    onPress={() =>
                      ImageURL._text === "NA"
                        ? null
                        : navigation.navigate("ImagePreview", {
                            imageUrl: ImageURL._text,
                          })
                    }
                  >
                    {ImageURL._text === "NA" ? "NA" : 'view'}
                  </Text>
                </Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                    navigation.navigate("Campaign", {
                      campId: CampaignID._text,
                    })
                  }
                  style={styles.uploadImgBtn}
                >
                  <Text style={styles.uploadImgText}>Upload Image</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.indicator}>
          {toggleIndicator ? (
            <Text>No campaign running</Text>
          ) : (
            <ActivityIndicator color="#522e90" size="large" />
          )}
        </View>
      )}
    </>
  );
};

export default CampaignList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  card: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dfdfdf',
    elevation: 2,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  header: {
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "#522e90",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerBackText: {
    color: "#fff",
    marginLeft: 15,
  },
  headerCenterText: {
    color: "#fff",
    marginLeft: -10,
  },
  previewText: {
    marginRight: 15,
  },
  campName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  campDesc: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  campDetails: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 10,
  },
  imageLink: {
    color: "#522e90",
    fontWeight: "600",
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImgBtn: {
    position: "absolute",
    height: 40,
    bottom: -20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    backgroundColor: "#522e90",
    borderRadius: 4,
    zIndex: 1,
    elevation: 1,
    flex: 1,
  },
  uploadImgText: {
    color: "#fff",
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
