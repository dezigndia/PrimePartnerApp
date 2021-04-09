import React from "react";
import { Image, Alert, BackHandler } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ActionTypes from "../../data/actionTypes";
import orm from "src/data";
import { getState } from "src/storeHelper";
import { NavigationActions, StackActions } from "react-navigation";
export default class SideBar extends React.Component {
  componentDidMount = () => {
    console.log(
      "SideBar",
      this.props.navigation,
      "NavigationAction",
      NavigationActions,
      "StackActions",
      StackActions
    );
  };
  render() {
    return (
      <Container style={{ backgroundColor: "#6633cc" }}>
        <Content>
          {/* <Image
            source={{
              uri: 'https://eastonialeopards.com/wp-content/uploads/2017/04/movie-article.jpg'
            }}
            style={{
              height: 120,
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          /> */}
          <List>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("HomeTAB")}
              style={{ flexDirection: "row" }}
            >
              {/* <Ionicons  color="white" size={20} name="ios-home" style={{paddingRight:5}}/> */}
              <Image
                source={require("../assets/Icons-02.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Home</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("EarnPointsTab")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-03.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Earn Points</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("Trend")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-04.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Trend</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("RewardCatalogue")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-06.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Reward Catalogue</Text>
            </ListItem>

            <ListItem 
              button
              onPress={() => this.props.navigation.navigate("CampaignList")}
              style={{ flexDirection: "row" }}
            >
              <MaterialIcons name="camera" size={25} color="#fff" />
              <Text style={{ color: "#fff" }}>Campaign</Text>
            </ListItem>

            <ListItem
              button
              onPress={() => this.props.navigation.navigate("ReddySKU")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-05.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Dr.Reddy's SKUs</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("MyProfile")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-07.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>My Profile</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("MyAccount")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-03.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>My Account</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("TermsConditions")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-08.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Terms & Conditions</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("TierGuide")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-09.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Tier Guide</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("AppSettings")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-10.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>App Settings</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("Notification")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-11.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Notifications (0)</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => this.props.navigation.navigate("ContactUs")}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/Icons-12.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Contact Us</Text>
            </ListItem>

            <ListItem
              button
              onPress={() => {
                Alert.alert(
                  "Logout",
                  "Do you want to logout",
                  [
                    {
                      text: "Logout",
                      onPress: () => {
                        const { dispatch } = this.props.navigation;
                        const User = Object.assign(
                          {},
                          {
                            id: 0,
                            login: false,
                          }
                        );
                        // dispatch({
                        //     type: ActionTypes.USER_DATA,
                        //     User
                        // });
                        dispatch({
                          type: ActionTypes.EMPTY_ORM,
                        });
                        // this.props.navigation.dispatch(StackActions.reset({
                        //   key: undefined,
                        //   index: 0,
                        //   actions:[NavigationActions.navigate({routeName: 'Login2'})]}))
                        this.props.navigation.navigate("Splash", {
                          logoutFlag: "true",
                        });
                        BackHandler.exitApp();
                      },
                    },
                    {
                      text: "cancel",
                      onPress: () => console.log("Cancel Pressed"),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={{ flexDirection: "row" }}
            >
              <Image
                source={require("../assets/power.png")}
                style={{
                  width: 25,
                  height: 20,
                  resizeMode: "contain",
                  paddingRight: 0,
                }}
              />
              <Text style={{ color: "#fff" }}>Logout</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
