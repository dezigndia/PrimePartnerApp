import React from "react";
import { Dimensions } from 'react-native';
let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createAppContainer,
  createDrawerNavigator,
} from "react-navigation";
import {
  Home,
  HomeTAB,
  MyAccount,
  EarnPoints,
  SideBar,
  TabBar,
  Trend,
  RewardCatalogue,
  ReddySKU,
  MyProfile,
  TermsConditions,
  TierGuide,
  AppSettings,
  Notification,
  ContactUs,
  Logout,
  Login,
  SignUp,
  RequestOTP,
  ForgotPassword,
  VerificationOTP,
  NewPassword,
  Splash,
  CatalogueHistory,
  RedemptionConfirmation,
  VerifyRedeemtionOTP,
  OrderConfirmation,
  ConfirmCode,
  CameraScreen,
  Congratulations,
  ChemistSignature,
  PSRSignature,
  SaveImage,
  Campaign,
  CampaignList,
  ImagePreview,
} from "../scenes";

export const MyAccountTab = createStackNavigator(
  {
    MyAccount: {
      screen: MyAccount,
    },
  },
  {
    headerMode: 'none',
  })
export const EarnPointsTab = createStackNavigator(
  {
    EarnPoints: { 
      screen: EarnPoints,
    },
    CameraScreen: {  screen: CameraScreen}, 
    ConfirmCode: {  screen: ConfirmCode}, 
    Congratulations: {  screen: Congratulations}, 

  },
  {
    headerMode: 'none',
  })
export const HomeTABS = createStackNavigator(
  {
    HomeTAB: {
      screen: HomeTAB,
    },
  },
  {
    headerMode: 'none',
  })


export const Tabs = createMaterialTopTabNavigator({
  MyAccount: {
    screen: MyAccountTab,
  },
  HomeTABS: {
    screen: HomeTABS,
  },
  EarnPointsTab: {
    screen: EarnPointsTab,
  },
 
},
{
  initialRouteName:'HomeTABS',
  tabBarComponent: props => <TabBar {...props} />,
  tabBarOptions:{
    activeTintColor:'#fff',
    showLabel:true,
    },
  lazy:true
})
export const MainTab = createStackNavigator({
  Tabs: { screen: Tabs }
},
{
  headerMode: 'none',
})
export const Splash1 = createStackNavigator({
  Splash: { screen: Splash }
},
{
  headerMode: 'none',
})

export const AppNavigator = createAppContainer(createDrawerNavigator(
  {
    MainTab: { screen: MainTab },
    Trend: {  screen: Trend},
    RewardCatalogue: {  screen: RewardCatalogue},
    ReddySKU: {  screen: ReddySKU},
    MyProfile: {  screen: MyProfile},
    TermsConditions: {  screen: TermsConditions},
    TierGuide: {  screen: TierGuide},
    AppSettings: {  screen: AppSettings},
    Notification: {  screen: Notification},
    ContactUs: {  screen: ContactUs},
    Logout: {  screen: Logout},
    Login: {  screen: Login},
    SignUp: {  screen: SignUp},
    RequestOTP: {screen: RequestOTP},
    ForgotPassword: {  screen: ForgotPassword},
    VerificationOTP: {  screen: VerificationOTP},
    NewPassword: {  screen: NewPassword},
    Splash: {  screen: Splash1}, 
    CatalogueHistory: {  screen: CatalogueHistory}, 
    RedemptionConfirmation: {  screen: RedemptionConfirmation}, 
    VerifyRedeemtionOTP: {  screen: VerifyRedeemtionOTP}, 
    OrderConfirmation: {  screen: OrderConfirmation}, 
    ChemistSignature: {  screen: ChemistSignature }, 
    PSRSignature: {  screen: PSRSignature }, 
    SaveImage: {  screen: SaveImage }, 
    Campaign: {screen: Campaign},
    CampaignList: {screen: CampaignList},
    ImagePreview: {screen: ImagePreview},
  },
  {
    initialRouteName:'Splash',
    contentComponent:props => <SideBar {...props} />,
    drawerWidth: SCREENWIDTH/1.8,
    headerMode:'screen',
    useNativeAnimations:true,
    drawerBackgroundColor:'#522e90',
    tabBarComponent: props => <TabBar {...props} />,
  }
));

const prevGetStateForActionHomeStack = AppNavigator.router.getStateForAction;
AppNavigator.router.getStateForAction = (action, state) => {
    if (state && action.type === 'ReplaceCurrentScreen') {
      const routes = state.routes.slice(0, state.routes.length - 1);
      routes.push(action);
      return {
        ...state,
        routes,
        index: routes.length - 1,
      };
    }
    return prevGetStateForActionHomeStack(action, state);
};

export default AppNavigator;
