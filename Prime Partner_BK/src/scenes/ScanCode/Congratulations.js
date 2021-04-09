import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, TouchableOpacity, Linking, Image } from 'react-native'
import { DrawerActions, NavigationAction } from 'react-navigation'
import Entypo from 'react-native-vector-icons/Entypo';

let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;

export default class Congratulations extends Component {
    static navigationOptions = {
        drawerLockMode: 'locked-closed'
      };
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
    render() {
        return (
            <View style={styles.container}>
                {/* <View style={styles.headerView}>
                   
                    <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Congratulations</Text>
               
                </View> */}
                <View style={{ flex:1, marginTop:40 }}>
                <Text style={{ fontSize:25, fontWeight:'400', letterSpacing:.8, color:'#000', alignSelf:'center', margin:5, marginTop:20, }}>{this.props.navigation.state.params.message} </Text>
                    {/* <Text style={{ fontSize:25, fontWeight:'400', letterSpacing:.8, color:'#000', alignSelf:'center', margin:5, marginTop:20, textAlign:'center', margin:20}}>Congratulations! You have earned 500 points Your latest Balance 54321 points</Text> */}
                    {/* <Text style={{ fontSize:18, fontWeight:'400', letterSpacing:.8, color:'#000', alignSelf:'center', margin:5, }}>You have earned</Text>
                    <Text style={{ fontSize:25, fontWeight:'400', letterSpacing:.8, color:'#000', alignSelf:'center', margin:5, }}>500 points</Text>
                    <Text style={{ fontSize:18, fontWeight:'400', letterSpacing:.8, color:'#000', alignSelf:'center', margin:5, }}>Your latest Balance</Text>
                    <Text style={{ fontSize:25, fontWeight:'400', letterSpacing:.8, color:'#000', alignSelf:'center', margin:5, }}>54321 points</Text> */}
                    <View style={{ height: 50, borderWidth:0, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:5, marginTop:20 }}>
                        <TouchableOpacity style={{ height:35, width:100, margin:5, flexDirection:'row', backgroundColor:'#6633cc', justifyContent:'center', alignItems:'center', padding:10, borderTopLeftRadius:5, borderBottomLeftRadius:5 }}
                            onPress={()=>{
                                // console.log("this.props.navigation", this.props.navigation);
                                this.props.navigation.replace('EarnPoints',{
                                    dummy:'data'
                                })
                            }}
                            
                        >
                            <Image source={require('../assets/Icons-03.png')}
                                style={{ width: 25, height: 20, resizeMode: 'contain', paddingRight: 0 }}   
                            />
                             <Text style={{color:'#fff'}}>Earn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height:35, width:100, margin:5, flexDirection:'row', backgroundColor:'#6633cc', justifyContent:'center', alignItems:'center', padding:10, borderTopRightRadius:5, borderBottomRightRadius:5, }}
                            onPress={()=>
                                this.props.navigation.navigate('RewardCatalogue',{
                                VerifyRedeemtionOTP:true
                             })
                        }
                        >
                            <Image source={require('../assets/Icons-06.png')}
                                style={{ width: 25, height: 20, resizeMode: 'contain', paddingRight: 0 }}
                            />
                             <Text style={{color:'#fff'}}>Redeem</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <Text style={styles.context}> Under Maintenance </Text> */}
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
        paddingLeft:10,
        paddingRight:10,
        justifyContent:'center',
        alignItems:'center',
    },
})