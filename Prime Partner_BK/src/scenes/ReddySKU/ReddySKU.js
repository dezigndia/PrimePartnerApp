import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo';
import { DrawerActions, NavigationAction } from 'react-navigation'
let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;
// import baseUrl from '../Constants/Constants';
import { baseUrlProdMiddleware } from '../Constants/production';
var parseString = require('xml2js').parseString;

export default class ReddySKUs extends Component {
    state={
        data:null,
        loading:true,
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    //     const details={
    //         // 'MobileNo': this.state.userName,
    //         // 'Password':this.state.password,
    //         // // 'MobileNo': '8879755940',
    //         // // 'Password':'poonam',
    //         // 'DeviceID':'sadasdasdasd'
    //     }
    // const Body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

    //     const options = {
    //         method: 'POST',
    //         body: Body,
    //         headers: {
    //             'Accept': 'multipart/form-data',
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         }
    //     };
    // console.log("result");
        let data=[];
        _that=this;
        try{
            fetch(baseUrlProdMiddleware+"/GetSKUPoints")
            // fetch("https://mobileapp.accentivrewards.com/DRL/PrimaWebService.asmx/GetSKUPoints")
            .then(res => res.text())
            .then(res => {
                // console.log("res:", res);
               parseString(res, async(err, result)=> {
                   console.log("result", result);
                   if(result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table!=undefined){
                    console.log("(result.DataSet['diffgr:diffgram']",result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table.length);
                    result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table.map((item,index)=>{
                        if(item.NoUnitsPerBox == undefined){
                            // console.log("item.NoUnitsPerBox[0]:", item.NoUnitsPerBox!='undefined' ?item.NoUnitsPerBox[0]: 0 ,index);
                            console.log("item.NoUnitsPerBox[0]:", item.NoUnitsPerBox ,index);
                            let obj={Gold:item.Gold[0], NoUnitsPerBox: 0, Platinum: item.Platinum[0], SKU: item.SKU[0], Silver: item.Silver[0]}
                            data.push(obj);
                        }
                        else{
                            let obj={Gold:item.Gold[0], NoUnitsPerBox:item.NoUnitsPerBox[0], Platinum: item.Platinum[0], SKU: item.SKU[0], Silver: item.Silver[0]}
                            data.push(obj);
                        }
                    })
                    _that.setState({
                        data:data,
                        loading:false
                    })
                    console.log(data);
                }
            })
        })
    }catch(er){
            _that.setState({
                loading:false
            })
            console.log("er",er);
        }
    }
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      }
      renderItem = ({ item }) =>{ 
        return(
            <View style={{height:SCREENHEIGHT*0.1, borderWidth:0, margin:5, elevation: 2}}>
                <View style={{justifyContent:'space-between', flexDirection:'row', paddingLeft:20, paddingRight:20, paddingTop:10, paddingBottom: 5}}>
                    <Text style={{fontSize:16 , color:'#000'}}> {item.SKU} </Text>
                    <Text style={{}}> {item.NoUnitsPerBox} </Text>
                </View>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <View style={{ backgroundColor:'#c0c0c0', paddingLeft:30, paddingRight:30, paddingTop:3, paddingBottom:3 }}>
                        <Text style={{color:'#fff'}}> {item.Silver} </Text>    
                    </View>
                    <View style={{ backgroundColor:'#d4af37', paddingLeft:30, paddingRight:30, paddingTop:3, paddingBottom:3 }}>
                        <Text style={{color:'#fff'}}> {item.Gold} </Text>
                    </View>
                    <View style={{ backgroundColor:'#000000', paddingLeft:30, paddingRight:30, paddingTop:3, paddingBottom:3 }}>
                        <Text style={{color:'#fff'}}> {item.Platinum} </Text>
                    </View>
                </View>
            </View> 
        )
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
                        {/* <Icon name="file-document-outline" size={30} color="#fff" style={{alignSelf:'center'}} /> */}
                        <TouchableOpacity style={{ alignSelf: 'center' }}
                            onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                        >
                            <Entypo
                                name="menu" size={30} color="#fff" style={{ alignSelf: 'center' }}
                            />
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Dr. Reddy's SKUs</Text>
                        <TouchableOpacity
                        >
                        </TouchableOpacity>
                </View>
                {this.state.data&&
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem}
                />}
                {
                    this.state.loading && 
                    <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator size='large' color='#6633cc'/>
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

    },
})