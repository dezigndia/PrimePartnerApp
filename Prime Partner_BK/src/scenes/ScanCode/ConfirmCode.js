import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import AnimateNumber from 'react-native-countup'
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationEvents, NavigationActions } from 'react-navigation';
let SCREENHEIGHT = Dimensions.get('screen').height;
let SCREENWIDTH = Dimensions.get('screen').width;

import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';
// import baseUrl from '../Constants/Constants';
import {baseUrlProdMiddleware} from '../Constants/production';
var parseString = require('xml2js').parseString;

export default class EarnPoints extends Component {
  constructor(props) {
    super(props);
    this.state = {
        code:'',
        modalVisible: false
    };
  }
  _getCode=()=>{
     
  } 
  componentDidMount() {
    console.log(this.props.navigation.state.params.code); 
    alert("code:"+this.props.navigation.state.params.code);
    this.setState({
        code:this.props.navigation.state.params.code
    })
  }
  _onSubmit = ()=>{
    const dbState = getState().data;
    const sess = orm.session(dbState);    
    console.log("sess",sess);
     if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { id, ChemistCardNo, mobile} = User.ref;

     
      const details = {
          'memberLogin': ChemistCardNo,
          'VoucherCode': this.state.code
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
      var _that=this;
      fetch(baseUrlProdMiddleware + '/GetEarnPoints', options)
          .then(res => res.text())
          .then(res => {
            this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible));            //   let data = JSON.parse(res);
              console.log("data:", res);
              this.setState({
                  code:''
              })
              parseString(res, async(err, result)=> {
                console.log("result",result);
                if (result.string._ === 'Voucher code has already been used') {
                    
                    Alert.alert(
                        'Prime Partner',
                        result.string._,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false },
                    );
                    
                }
                else if (result.string._ === 'Sorry!! You do not have permission to scan the Code.') {
  
                    Alert.alert(
                        'Prime Partner',
                        result.string._,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false },
                    );
                    
                }
                else if (result.string._ === 'Wrong VoucherCode') {
  
                    Alert.alert(
                        'Prime Partner',
                        result.string._,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false },
                    );
                    
                }
                else if (result.string._ === 'Invalid VoucherCode') {
  
                    Alert.alert(
                        'Prime Partner',
                        result.string._,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false },
                    );
                    
                } 
                else if (result.string._ === 'SKU is blocked') {
  
                    Alert.alert(
                        'Prime Partner',
                        result.string._,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false },
                    );
                    
                } else {
                    _that.props.navigation.navigate('Congratulations',{
                        message:result.string._
                    });
                }
              })

          })
          .catch((err) => {
              console.log('error:', err);
               this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible));  
              // Alert.alert(
              //     'Prime Partner',
              //     'Invalid entered OTP',
              //     [
              //         { text: 'OK', onPress: () => console.log('OK Pressed') },
              //     ],
              //     { cancelable: false },
              // );
              // alert(JSON.stringify(err));
          })
        }
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    }   
  render() {
    return (
        <View style={styles.container}>
            {/* <View style={styles.headerView}>
                <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Confirm Code</Text>
            </View> */}
            <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 10,}}>

                <Text style={ { marginTop: 10, alignSelf:'center', fontSize:25, color:'#000', fontWeight:'400' }}> Confirm the Code </Text>
                <Text 
                    onPress={()=>this.props.navigation.replace('CameraScreen',{
                        dummy:'data'
                    })}
                style={{alignSelf:'center', fontSize:16, color:'#6633cc'}}> re-scan the code </Text>
                {/* <Text></Text> */}
                <Text></Text>
                <TextInput
                    value={this.state.code}
                    keyboardType='decimal-pad'
                    placeholder='Enter the code'
                    placeholderTextColor='#4a4a4a'
                    style={{ borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: 1, borderColor: '#67c2e1', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, color:'#6633cc' }}
                />
                
                <TouchableOpacity
                    style={{ height: 40, width: 150, marginTop: 20, backgroundColor: '#6633cc', alignSelf: 'center', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                    onPress={()=>{
                        this.setState({modalVisible: true});
                        this._onSubmit();
                        // this.props.navigation.navigate('EarnPoints')
                        }}
                >
                    <Text style={{ color: '#fff', }}>Submit</Text>
                </TouchableOpacity>
            </View>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <ActivityIndicator style={{ alignSelf: 'center' }} size="large" color="#0000ff" />
                    </View>
                </Modal>
        </View>
    );
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
    headerView:{
        height:SCREENHEIGHT * 0.06,
        backgroundColor:'#6633cc',
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:10,
        paddingRight:10,

    },
})