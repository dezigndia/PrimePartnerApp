import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, TouchableOpacity, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo';
var parseString = require('xml2js').parseString;
import { DrawerActions,  NavigationActions, StackActions } from 'react-navigation'
import {baseUrlProdMiddleware} from '../Constants/production';
import ImageView from 'react-native-image-view';
import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';

import { getState } from 'src/storeHelper';

let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;

export default class Notifications extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            Added_Date:'',
            ID:'', 
            Mobile:'', 
            Notification:'',
            NotificationID:'',
            loading:true,
            data:null,
            offer:'',
            isImageViewVisible:false,
        }
    }
    _getNotifications = ()=>{
        let data=[];
        _that=this;
        try{
            const dbState = getState().data;
        const sess = orm.session(dbState);    
        console.log("sess",sess);
        // alert(ID)
        if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, ChemistCardNo} = User.ref;
            const details = {
                'MemberId': ChemistCardNo,
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
            fetch(baseUrlProdMiddleware+"/GetUserWise_NotificationList",options)
            .then(res => res.text())
            .then(res => {
                console.log("GetUserWise_NotificationList res:", res);
               parseString(res, async(err, result)=> {
                   console.log("result", result);
                
                   if(result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table!=undefined){
                    // console.log("(result.DataSet['diffgr:diffgram']",result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table);
                    result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table.map((item,index)=>{
                        // console.log('item',item);
                        let str1=item.Notification[0];
                        let start=str1.indexOf('src=');
                        let end= str1.indexOf('.jpg"');
                        let modifyingString =str1.substring(start,end );

                        let title=item.Notification[0];
                        // let start1=title.indexOf('<strong>');
                        // let end1= title.indexOf('</strong>');
                        // let modifyingString1 =str1.substring(start1,end1 );
                        
                        // console.log(title.replace(/<\/?[^>]+(>|$)/g, ""));
                        title= title.replace(/<\/?[^>]+(>|$)/g, "");
                        title= title.replace(/&amp;/g, "");
                        title= title.replace(/&rsquo;/g,"");
                        title= title.replace(/&nbsp;/g,"");
                        // console.log(d);
                        // console.log("modifyingString:", modifyingString.substring(5,)+'.jpg');
                        let obj={
                            Added_Date:item.Added_Date[0], 
                            ID:item.ID[0], 
                            Mobile:item.Mobile[0], 
                            Notification:modifyingString.substring(5,)+'.jpg',
                            NotificationID:item.NotificationID[0],
                            offer:title
                        }
                        data.push(obj);
                    })
                    _that.setState({
                        data:data,
                        loading:false
                    })
                    _that.setState({
                        loading:false
                    })
                    // console.log(data);
                }
                console.log('outttttttttttttt')
               })
            })
        }
        }catch(er){
            console.log("er",er);
            _that.setState({
                loading:false
            })
            alert('Something went wrong!');
        }

    }

    componentDidMount() {
        console.log("this.props.navigation", this.props, "NavigationActions", NavigationActions);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this._getNotifications();       
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.navigate('HomeTABS');
        // this.goBack(); // works best when the goBack is async
        return true;
    }
    _onDelete= (ID)=>{
        const dbState = getState().data;
        const sess = orm.session(dbState);    
        console.log("sess",sess);
        // alert(ID)
        if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, ChemistCardNo} = User.ref;

          const details = {
            // 'MemberId': '23300027',
            'MemberId':ChemistCardNo,
            'id':ID
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
        fetch(baseUrlProdMiddleware+"/DeleteUserWise_Notification",options)
        .then(res => res.text())
        .then(res => {
            console.log("DeleteUserWise_Notification res:", res);
            var _that= this;
            this.setState({ loading: true }, () =>this._getNotifications());
            // this.setState({loading:false},()=>NavigationActions.navigate({ routeName: 'Notification' }));
            // this.setState({loading:false},()=>_that.props.navigation.reset([NavigationAction.navigate({ routeName: 'Notification' })], 0));
           parseString(res, async(err, result)=> {
               console.log("result", result);
           })
        })

        }
    }
    renderItem = ({ item,index }) =>{
        return(
            <View style={{ borderWidth:0, margin:5, elevation:2 }}>
                   <View
                    style={{justifyContent:'space-between',  flexDirection:'row', borderWidth:0, marginLeft:2, marginRight:2}}
                   >
                       <Text style={{fontSize:18, color:'red', fontWeight:'600', borderWidth:0}} numberOfLines={1} ellipsizeMode={'tail'}>{
                        item.Notification==='.jpg' ? null : 
                        item.offer
                       }</Text>
                       <TouchableOpacity
                        style={{ borderWidth:0, height:30, width:40, }}
                        onPress={()=>
                            this.setState({loading:true},()=> this._onDelete(item.ID))
                            }
                       >
                           <Image
                               source={require('../assets/delete.png')}
                               style={{height:30, width:40, resizeMode:'contain'}}
                           />
                       </TouchableOpacity>
                   </View>
                   <View>
                    {
                        item.Notification === '.jpg' ?
                            <Text style={{fontSize:18, color:'red', fontWeight:'600', padding:10}}>{item.offer}</Text>
                            :
                            <TouchableOpacity 
                                onPress={()=>this.setState({isImageViewVisible:true, image:item.Notification})}
                            >
                            <Image
                                style={{ height: SCREENHEIGHT * .2, resizeMode: 'contain' }}
                                source={{ uri: item.Notification }}
                            />
                            </TouchableOpacity>
                    }
                   </View>
                    <View style={{justifyContent:"flex-end", alignItems:"flex-end", borderWidth:0, padding:10}}>
                        {/* <Text>{new Date(item.Added_Date).toLocaleString('en-US', { hour: 'numeric', hour12: true })}</Text> */}
                        <Text>
                        {
                            new Date(item.Added_Date).getFullYear()+'-'+( new Date(item.Added_Date).getMonth()+1)+'-'+new Date(item.Added_Date).getDate()
                            +' '+
                            new Date(item.Added_Date).getHours() + ":" + new Date(item.Added_Date).getMinutes() + ":" + new Date(item.Added_Date).getSeconds()
                        }
                        </Text>
                    </View>
            </View>
        )
    }
        
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Entypo 
                        name="menu" size={30} color="#fff" style={{alignSelf:'center'}}    
                        onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    />
                    <Text style={{color:'#fff', alignSelf:'center', fontSize:18}}>Notifications</Text>
                    <TouchableOpacity
                        // onPress={()=>this.props.navigation.navigate("CatalogueHistory")}
                        style={{ width: 35, height: 35, resizeMode: 'contain', paddingRight: 0, alignSelf:"center" }}
                    >
                
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    {
                        !this.state.loading ? 
                        <FlatList
                            data={this.state.data}
                            renderItem={this.renderItem}
                        />
                        
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' color='#6633cc' />
                        </View>
                    }
                </View>
                <ImageView
                    images={[
                            {
                                source: {
                                    uri: this.state.image,
                                },
                            },
                            ]}
                    imageIndex={0}
                    isVisible={this.state.isImageViewVisible}
                    renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
                    onClose={()=>this.setState({isImageViewVisible:false})}
                />
                {/* <Text style={styles.context}> Notifications </Text> */}
            </View>
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
    headerView:{
        height:SCREENHEIGHT * 0.06,
        backgroundColor:'#6633cc',
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10,
    }
})