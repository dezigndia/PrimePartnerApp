import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, SafeAreaView, ImageBackground, Image, TextInput, TouchableOpacity, Modal, ActivityIndicator, Alert, ScrollView } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
// import baseUrl from '../Constants/Constants';
import {baseUrlProdMiddleware} from '../Constants/production';
import XMLParser  from 'react-xml-parser'
var parseString = require('xml2js').parseString;
import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import DeviceInfo from 'react-native-device-info';
import { getState } from 'src/storeHelper';

let SCREENWIDTH= Dimensions.get('screen').width;
let SCREENHEIGHT= Dimensions.get('screen').height;
// import xml2json from '../Xml2Json/Xml2Json';

export default class NewPassword extends Component {
    constructor(props) {
      super(props)
      this.state = {
         code:'',
         password1:'',
         password2:'',
         loading:false,
         modalVisible: false,
         ChemistCardNo:"",
      };
    };
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        console.log("this.props.navigation", this.props.navigation)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    handleBackPress = () => {
        if(this.props.navigation.state.params != undefined){
            this.props.navigation.navigate('AppSettings');
        }else{
            this.props.navigation.navigate('ForgotPassword');
        }
        // this.props.navigation.goBack();
        return true;
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
 
    newPassword = () =>{
        const dbState = getState().data;
        const sess = orm.session(dbState);    
        console.log("sess",sess);
        if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, Balance, Output, Membership, TotalEarnPoint, password, mobile, ChemistCardNo } = User.ref;
            this.setState({
                ChemistCardNo:ChemistCardNo
            })
        
        const details={
            'MemberId': ChemistCardNo,
            'DeviceID': DeviceInfo.getUniqueId(),
            'Password':this.state.password2
        }
        console.log("details:", details);
        const Body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        const options = {
            method: 'POST',
            body: Body,
            headers: {
                'Accept': 'multipart/form-data',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
          var _that= this;
          fetch(baseUrlProdMiddleware+'/SaveMember', options)
            .then(res =>res.text())

            .then(res => {
                this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible))               
                parseString(res, async(err, result)=> {if(result.Value.AccountID[0]!='NA'){
                    console.log('result',result.Value, _that.props.navigation);
                    const { dispatch } = _that.props.navigation;
                    const User = Object.assign({}, {
                        id:0,
                        mobile:_that.state.userName,
                        AccountID:result.Value.AccountID[0],
                        AccountTypeID:result.Value.AccountTypeID[0],
                        Balance:result.Value.Balance[0],
                        ChemistCardNo:result.Value.ChemistCardNo[0],
                        DaysRemainingforNextTier:result.Value.DaysRemainingforNextTier[0],
                        LastTierUpgradeDate:result.Value.LastTierUpgradeDate[0],
                        Membership:result.Value.Membership[0],
                        NextTierLevel:result.Value.NextTierLevel[0],
                        Output:result.Value.Output[0],
                        Points:result.Value.Points[0],
                        PointsEarned:result.Value.PointsEarned[0],
                        PointsRequired:result.Value.PointsRequired[0],
                        TotalEarnPoint:result.Value.TotalEarnPoint[0],
                        TotalExpiredPoint:result.Value.TotalExpiredPoint[0],
                        TotalSpentPoint:result.Value.TotalSpentPoint[0],
                        UpdatedBy:result.Value.UpdatedBy[0],
                        UpdatedOn:result.Value.UpdatedOn[0],
                        CreatedBy:result.Value.CreatedBy[0],        
                        login:"true",
                        password:_that.state.password,                
                    });
                    dispatch({
                        type: ActionTypes.USER_DATA, 
                        User 
                    });
                    _that.props.navigation.navigate('MainTab');
                    Alert.alert(
                        'Prime Partner',
                        'Login successfully',
                        [
                          {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        {cancelable: false},
                      );
                    // alert('Login successfully');
                    const dbState = getState().data;
                    const sess = orm.session(dbState);    
                    console.log("sess",sess);
                }
                })
            })
            .catch((err)=>{
                console.log('error:',err);
                Alert.alert(
                    'Prime Partner',
                    'Something went went wrong, please tay again!',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
                alert(JSON.stringify(err));
            })
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <ImageBackground 
                    source={require('../assets/background.png')}
                    style={styles.imageBackground}
                >
                       <View style={styles.imagesView}>
                            <View style={styles.reddysImageView}>
                                {/* <Text>image 1</Text> */}
                                <Image 
                                    source={require('../assets/drreddy.png')} 
                                    style={styles.reddysImage}
                                />
                            </View>
                            <View style={styles.primePartnerView}>
                                <Image 
                                    source={require('../assets/primePartner.png')} 
                                    style={styles.primePartnerImage}
                                />
                                {/* <Text>image 2</Text> */}
                            </View>
                       </View>
                    
                       <View style={styles.formView}>
                            <Form style={styles.form}>
                                <Item 
                                    style={styles.item}
                                 >
                                    <TextInput 
                                        style={styles.inputVerification}
                                        placeholder='Enter New Password'
                                        placeholderTextColor='#522e90'
                                        onChangeText={(password1)=>this.setState({password1})}
                                        secureTextEntry={true}
                                    />
                                </Item>
                                <Item 
                                    style={styles.item}
                                 >
                                    <TextInput 
                                        style={styles.inputVerification}
                                        placeholder='Confirm Password'
                                        placeholderTextColor='#522e90'
                                        onChangeText={(password2)=>this.setState({password2})}
                                        secureTextEntry={true}
                                    />
                                </Item>
                                <Item inlineLabel 
                                    style={styles.item}
                                >
                                    <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={()=>{
                                            if(this.state.password1!=""&& this.state.password2!=""){
                                                if(this.state.password1 === this.state.password2 ){
                                                this.setState({loading:true},
                                                ()=>{
                                                    this.newPassword();
                                                    this.setModalVisible(true);
                                                    })
                                                }else{
                                                    Alert.alert(
                                                    'Prime Partner',
                                                    'Password not matched!',
                                                    [
                                                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                                                    ],
                                                    { cancelable: false },
                                                );
                                                }

                                            }else{
                                                Alert.alert(
                                                    'Prime Partner',
                                                    'Please enter the new password',
                                                    [
                                                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                                                    ],
                                                    { cancelable: false },
                                                );
                                            }
                                            }}
                                    >
                                        <Text style={styles.SubmitText}>Submit</Text>
                                    </TouchableOpacity>
                                </Item>
                            </Form>
                       </View>
                      
                </ImageBackground>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            // Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.modalView}>
                        <ActivityIndicator style={styles.spinner} size="large" color="#0000ff" />
                        </View>
                    </Modal>
            </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        // justifyContent:'center',
    },
    context:{
        alignSelf:'center',
        textAlign:'center'
    },
    imageBackground:{
        flex:1,
        width:'100%', 
        height:'100%'
    },
    imagesView:{
        height:SCREENHEIGHT/3.5,
        borderWidth:0
    },
    reddysImageView:{
        height:'20%',
        borderWidth:0
    },
    reddysImage:{
        height:25,
        width:120, 
        alignSelf:'flex-end', 
        right:10,
        top:10, 
        bottom:0
    },
    primePartnerView:{
        height:'80%',
        borderWidth:0,
        justifyContent:'center'
    },
    primePartnerImage:{
        alignSelf:'center', 
        height:SCREENWIDTH/5, 
        width:SCREENWIDTH/2
    },
    formView:{
        // height:SCREENHEIGHT/3,
        borderWidth:0
    },
    form:{
        paddingLeft:40,
        paddingRight:40,
        paddingTop:20,
        borderWidth:0,
    },
    item:{
        borderBottomWidth:0,
        marginTop:10
    },
    inputVerification:{
        borderRadius:10,
        borderWidth:0, 
        flex:1, 
        backgroundColor:'#fff',
         marginTop:7, 
         height:40,
         elevation:4
    },
    submitButton:{
        flex:1, 
        height:40, 
        backgroundColor:'#522e90', 
        alignSelf:'center', 
        borderRadius:10, 
        justifyContent:'center', 
        marginTop:50, 
        borderWidth:0,
        marginTop:7,
    },
    SubmitText:{
        color:'#fff', 
        alignSelf:'center'
    },
    iteResendPassword:{
        justifyContent:'center', 
        borderBottomWidth:0, 
        margin:10
    },
    textResendPassword:{
        fontSize: 16, 
        alignSelf: 'center', 
        bottom: 0.,
        color:'#a9b9bf'
    },
    enrollView:{
        height:SCREENHEIGHT/3,
        borderWidth:0
    },
    enrollText:{
        color: '#88bffa', 
        alignSelf: 'center', 
        fontSize: 16 
    },
    modalView:{
        flex:1, 
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0.3)' 
    },
    spinner:{
        alignSelf:'center'
    }
})