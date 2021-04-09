import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, Image, FlatList, ActivityIndicator, BackHandler, TouchableOpacity, ScrollView } from 'react-native'
let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;
import { DrawerActions, NavigationAction } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo';

// import baseUrl from '../Constants/Constants';
import { baseUrlProdMiddleware } from '../Constants/production';
import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';

var parseString = require('xml2js').parseString;

export default class MyProfile extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        Address:'',
        ChemistAnniversary:'',
        ChemistDOB:'',
        ChemistShopName:'',
        City:'',
        DrugLicenseNo:'',
        FirstName:'',
        MemberEmail:'',
        MobileNo:'',
        MobileNo1:'',
        PSREmpCode:'',
        Pincode:'',
        SpouseName:'',
        State:'',
        loading:true,
      };
    };
    
    componentDidMount = () =>{ 
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        const dbState = getState().data;
        const sess = orm.session(dbState);    
        if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, ChemistCardNo, } = User.ref;
          this.setState({ MemberLogin: ChemistCardNo, },)
            const details = {
            'MemberLogin': ChemistCardNo,
            // 'MemberLogin': '23300056',
            // 'MemberLogin': '23300027',
            // 'MemberLogin': '23300020',
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
          let data=[];
          _that=this;
          fetch(baseUrlProdMiddleware + '/GetMemberProfile', options)
            .then(res => res.text())
            .then(res => {
                parseString(res, async(err, result)=> {
                    console.log("result.Value.FirstName.length",result.Value.FirstName.length);
                    if(result.Value.FirstName.length){
                    _that.setState({
                        Address:result.Value.Address[0],
                        ChemistAnniversary:result.Value.ChemistAnniversary[0],
                        ChemistDOB:result.Value.ChemistDOB[0],
                        ChemistShopName:result.Value.ChemistShopName[0],
                        City:result.Value.City[0],
                        DrugLicenseNo:result.Value.DrugLicenseNo[0],
                        FirstName:result.Value.FirstName[0],
                        MemberEmail:result.Value.FirstName[0],
                        MobileNo:result.Value.MobileNo[0],
                        MobileNo1:result.Value.MobileNo1[0],
                        PSREmpCode:result.Value.PSREmpCode[0],
                        Pincode:result.Value.Pincode[0],
                        SpouseName:result.Value.SpouseName[0],
                        State:result.Value.State[0],
                        loading:false,
                    })    
                }
            })
         })
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.navigate('HomeTABS');
        // this.goBack(); // works best when the goBack is async
        return true;
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <TouchableOpacity style={{ alignSelf: 'center' }}
                        onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    >
                        <Entypo name="menu" size={30} color="#fff" style={{ alignSelf: 'center' }}/>
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>My Profile</Text>
                    <TouchableOpacity
                    >
                    </TouchableOpacity>
                </View>
                {
                    !this.state.loading ? 

                <ScrollView>
                <View style={{flex:1, justifyContent:"flex-start", alignItems:'flex-start',}}> 
                    <View style={{ padding:10 ,borderWidth:0, backgroundColor:'#87cefa', margin:10, borderRadius:5, elevation:5, width: SCREENWIDTH-25}}>
                        <Text style={{ color:'#6633cc', fontSize:16, letterSpacing:.8,}}>Chemist Shop Name: {this.state.ChemistShopName}</Text>
                        <Text style={{ color:'#000000',fontSize:16, letterSpacing:.8,}}>Key Person Name: {this.state.FirstName} </Text>
                        <Text style={{ color:'#000000',fontSize:16, letterSpacing:.8,}}>Membership No:{this.state.MemberLogin} </Text>
                        <Text style={{ color:'#000000',fontSize:16, letterSpacing:.8,}}>Email:{this.state.MemberEmail} </Text>
                        <Text style={{ color:'#000000',fontSize:16, letterSpacing:.8,}}>Birthday: {this.state.ChemistDOB} </Text>
                        <Text style={{ color:'#000000',fontSize:16, letterSpacing:.8,}}>Anniversary : {this.state.ChemistAnniversary} </Text>
                    </View>
                  <View style={{elevation:5, borderRadius:5, margin:10, backgroundColor:'#fff'}}> 
                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>DL No.</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>{this.state.DrugLicenseNo}</Text> 
                        </View>
                    </View>

                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Address</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>{this.state.Address}</Text> 
                        </View>
                    </View>

                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>City</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>{this.state.City}</Text> 
                        </View>
                    </View>

                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>State</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>{this.state.State}</Text> 
                        </View>
                    </View>

                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Pin Code</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>{this.state.Pincode}</Text> 
                        </View>
                    </View>

                    {/* <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Current Membership Date</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}></Text> 
                        </View>
                    </View>

                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Joing Date</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>Not Mentioned</Text> 
                        </View>
                    </View> */}

                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Medical Rep</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>{this.state.PSREmpCode}</Text> 
                        </View>
                    </View>

                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Spouse Name</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>{this.state.SpouseName}</Text>   
                        </View>
                    </View>

                    <View style={{margin:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                        <View style={{width:'50%'}}>
                            <Text style={{color:'#000000'}}>Secondary Mobile</Text> 
                        </View>
                        <View style={{width:'50%', justifyContent:'flex-start'}}>
                            <Text style={{color:'#6633cc'}}>{this.state.MobileNo1}</Text> 
                        </View>
                    </View>    
                  </View>
                </View>
                </ScrollView>
                    :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' color='#6633cc' />
                </View> 
                }
            </View>
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

    },
})