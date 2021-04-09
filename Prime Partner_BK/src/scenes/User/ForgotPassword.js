import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, SafeAreaView, ImageBackground, Image, TextInput, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import baseUrl from '../Constants/Constants';
import { baseUrlProd } from "../Constants/production";


var parseString = require('xml2js').parseString;


let SCREENWIDTH= Dimensions.get('screen').width;
let SCREENHEIGHT= Dimensions.get('screen').height;
// import xml2json from '../Xml2Json/Xml2Json';

export default class ForgetPassword extends Component {
    constructor(props) {
      super(props)
      this.state = {
         mobile:'',
         referralCode:'',
         loading:false,
         modalVisible: false,
      };
    };
    componentDidMount() {
        // this._onLogin();
    }    
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
 

    _onForgetPassword = () =>{
        
                const details={
                'Mobile': this.state.mobile,
                'RefralCode':this.state.referralCode,
            }
        const Body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        const options = {
            method: 'POST',
            body: Body,
            headers: {
                'Accept': 'multipart/form-data',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
          
          fetch(baseUrlProd+'/GetOTP', options)
            .then(res =>res.text())
            .then(res => {
                this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible));
               
                    data=JSON.parse(res)
                    console.log(":res",data[0].OTP)
                    // alert('otp is:'+data[0].OTP);
                    this.props.navigation.navigate('VerificationOTP',{
                        mobile:this.state.mobile
                    })
                
            })
            .catch((err)=>{
                this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible));
                Alert.alert(
                    'Prime Partner',
                    'please enter valid details',
                    [
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                  );
                console.log('error',err)
            })
        
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={{
                    backgroundColor:"#522e90",
                    height:SCREENHEIGHT * 0.04,
                    flexDirection:"row",
                }}>
                    <TouchableOpacity
                        style={{width:'35%',height:'100%'}}
                        onPress={()=>this.props.navigation.navigate("Login")}
                    >
                        <Text style={{marginLeft:20,color:'#fff'}}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width:'60%',height:'100%'}}
                    disabled
                    >
                        <Text style={{alignSelf:'flex-start', color:'#fff'}}>Forget Password</Text>         
                    </TouchableOpacity>
                </View>
                <ImageBackground 
                    source={require('../assets/background.png')}
                    style={{flex:1,width:'100%', height:'100%'}}
                >
                       <View style={{height:SCREENHEIGHT/3.5,borderWidth:0}}>
                            <View style={{height:'20%',borderWidth:0}}>
                                
                                {/* <Image 
                                    source={require('../assets/drreddy.png')} 
                                    style={{height:25,width:SCREENWIDTH/3.5, alignSelf:'flex-end', right:20,top:10, bottom:0}}
                                /> */}
                            </View>
                            <View style={{height:'80%',borderWidth:0,justifyContent:'center'}}>
                                <Image 
                                    source={require('../assets/primePartner.png')} 
                                    style={{alignSelf:'center', height:SCREENWIDTH/5, width:SCREENWIDTH/2}}
                                />
                                {/* <Text>image 2</Text> */}
                            </View>
                       </View>
                       <View style={{height:SCREENHEIGHT/3,borderWidth:0}}>
                            <Form style={{padding:40}}>
                                <Item inlineLabel 
                                style={{borderBottomWidth:0}}
                                >
                                    <TextInput 
                                        style={{borderRadius:20,borderWidth:0, flex:1, backgroundColor:'#fff', marginBottom:7, height:40}}
                                        placeholder='Registered Mobile No'
                                        placeholderTextColor='#522e90'
                                        onChangeText={(mobile)=>this.setState({mobile})}
                                        keyboardType='number-pad'
                                    />
                                </Item>
                                <Item 
                                    style={{borderBottomWidth:0}}
                                 >
                                    <TextInput 
                                        style={{borderRadius:20, borderWidth:0, flex:1, backgroundColor:'#fff', marginTop:7, height:40}}
                                        placeholder='Referral Code'
                                        placeholderTextColor='#522e90'
                                        onChangeText={(referralCode)=>this.setState({referralCode})}
                                        // secureTextEntry={true}
                                    />
                                </Item>
                                <Item inlineLabel 
                                    style={{borderBottomWidth:0}}
                                >
                                    <TouchableOpacity
                                        style={{flex:1, height:40, backgroundColor:'#522e90', alignSelf:'center', borderRadius:10, justifyContent:'center', marginTop:10, borderWidth:0}}
                                        onPress={()=>{
                                            if(this.state.mobile!="" && this.state.mobile.length == 10 ){
                                            this.setState({loading:true},
                                            ()=>{
                                                this._onForgetPassword();
                                                this.setModalVisible(true);
                                                })
                                            }else{
                                                Alert.alert(
                                                    'Prime Partner',
                                                    'Please enter correct details',
                                                    [
                                                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                                                    ],
                                                    { cancelable: false },
                                                );
                                            }

                                            }}
                                    >
                                        <Text style={{color:'#fff', alignSelf:'center'}}>Submit</Text>
                                    </TouchableOpacity>
                                </Item>
                            </Form>
                       </View>
                       <View style={{height:SCREENHEIGHT/3,borderWidth:0}}>
                            <TouchableOpacity disabled>
                                <Text style={{ color: "#4a4a4a", alignSelf: 'center', fontSize: 16 }}>Note : Only use registered prime mobile no.</Text>
                            </TouchableOpacity>
                       </View>
                </ImageBackground>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            // Alert.alert('Modal has been closed.');
                        }}>
                        <View style={{flex:1, justifyContent:'center',backgroundColor:'rgba(0,0,0,0.3)' }}>
                        <ActivityIndicator style={{alignSelf:'center'}} size="large" color="#0000ff" />
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
        justifyContent:'center',
    },
    context:{
        alignSelf:'center',
        textAlign:'center'
    }
})