import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, TouchableOpacity, Linking, SafeAreaView, Share, TextInput } from 'react-native'
import { DrawerActions, NavigationAction } from 'react-navigation'
import {  Toast } from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import { Dialog } from 'react-native-simple-dialogs';
import Stars from 'react-native-stars';

// import baseUrl from '../Constants/Constants';
import {baseUrlProdMiddleware} from '../Constants/production';
import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';

var parseString = require('xml2js').parseString;

let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;

export default class AppSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogVisible: false,
            stars: 0,
            comment: '',
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.navigate('HomeTABS');
        // this.goBack(); // works best when the goBack is async
        return true;
    }
    onShare = async () => {
        try {
            const result = await Share.share({
                message:'https://play.google.com/store/apps/details?id=com.techvertica.primepartner.beta',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log("result.activityType", result.activityType);
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    showDialog = () => {
        this.setState({ dialogVisible: true });
    };
    _onSubmit = () => {
        const dbState = getState().data;
        const sess = orm.session(dbState);    
        if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, ChemistCardNo, } = User.ref;
          this.setState({ MemberLogin: ChemistCardNo, },)
            const details = {
            'MemberLogin': ChemistCardNo,
            // 'MemberLogin': '23300056',
            'Rating':this.state.stars,
            'Comment':this.state.comment,
            // 'MemberLogin': '23300027',
            // 'MemberLogin': '23300020',
          }
          console.log("details",details)
          const Body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
          const options = {
            method: 'POST',
            body: Body,
            headers: {
              'Accept': 'multipart/form-data',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };
          let data=[];
          _that=this;
          fetch(baseUrlProdMiddleware + '/RateUs', options)
            .then(res => res.text())
            .then(res => {
                console.log('res:',res);
                parseString(res, async(err, result)=> {
                    console.log('result:',result.string._);
                    Toast.show({
                        text: result.string._,
                        duration: 3000,
                        position: "bottom"
                      })
                })
            })
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <TouchableOpacity style={{ alignSelf: 'center' }}
                        onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    >
                        <Entypo name="menu" size={30} color="#fff" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>App Settings</Text>
                    <TouchableOpacity
                    >
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <View style={{borderBottomWidth:1, height: SCREENHEIGHT * 0.08, borderWidth:0, paddingLeft: 10}}>
                        <Text 
                        onPress={this.onShare}
                        style={{fontSize:18, color:'#000', fontWeight:'600'}}>Share</Text>
                        <Text 
                        onPress={this.onShare}
                        style={{fontSize:16, color:'#4a4a4a',}}>Share App</Text>
                    </View>
                    <View style={{borderBottomWidth:1, height: SCREENHEIGHT * 0.08, borderWidth:0, paddingLeft: 10}}>
                        <Text 
                        onPress={this.showDialog}
                        style={{fontSize:18, color:'#000', fontWeight:'600'}}>Rate Us</Text>
                        <Text 
                        onPress={this.showDialog}
                        style={{fontSize:16, color:'#4a4a4a',}}>Rate Us App</Text>
                    </View>
                    {/* <View style={{borderBottomWidth:1, height: SCREENHEIGHT * 0.08, borderWidth:0, paddingLeft: 10}}>
                        <Text onPress={()=>this.props.navigation.navigate('NewPassword',{
                            changePassword:'true'
                        })} style={{fontSize:18, color:'#000', fontWeight:'600'}}>Change Password</Text>
                        <Text onPress={()=>this.props.navigation.navigate('NewPassword',{
                            changePassword:'true'
                        })} style={{fontSize:16, color:'#4a4a4a',}}>Change your Password</Text>
                    </View> */}
                </View>
                    
                    
                    



                    <Dialog
                        visible={this.state.dialogVisible}
                        title="Rate Us"
                        onTouchOutside={() => this.setState({ dialogVisible: false })} >
                        <View style={{height:SCREENHEIGHT * 0.3, width: SCREENWIDTH -100, justifyContent:'center', backgroundColor:'#ffffff', borderRadius:5}}>
                           <View style={{ borderWidth:0}}>
                           <Stars
                                style={{alignSelf:'center'}}
                                half={false}
                                default={0}
                                update={(val) => { this.setState({ stars: val }) }}
                                spacing={6}
                                starSize={40}
                                count={5}
                                fullStar={require('../assets/starFilled.png')}
                                emptyStar={require('../assets/starEmpty.png')}
                                halfStar={require('../assets/starHalf.png')} 
                                />
                            <TextInput
                                style={{height:40, borderBottomWidth:1, borderLeftWidth:0, borderRightWidth:0, borderColor:'#6633cc', marginTop:20}}
                                placeholder={'Please Enter Your Comment !'}
                                placeholderTextColor={'#6633cc'}
                                value={this.state.comment}
                                onChangeText={(comment)=>this.setState({comment:comment})}
                            />
                            <TouchableOpacity
                                style={{height:40, justifyContent:'center', alignItems:'center', backgroundColor:'#6633cc', borderRadius:5, marginTop:40}}
                                onPress={()=>this.setState({
                                    dialogVisible: false
                                },() =>this._onSubmit())}
                            >
                                <Text style={{color:'#fff'}}>Submit</Text>
                            </TouchableOpacity>
                           </View>
                        </View>
                    </Dialog>
{/* <Text style={styles.context}> AppSettings </Text> */}
            </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    context:{
        alignSelf:'center',
        textAlign:'center'
    },
    headerView:{
        height:SCREENHEIGHT * 0.06,
        backgroundColor:'#6633cc',
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10,

    }
})