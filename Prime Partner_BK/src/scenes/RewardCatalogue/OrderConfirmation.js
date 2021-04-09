import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, TouchableOpacity, Image, ImageBackground } from 'react-native'
import { DrawerActions, NavigationAction } from 'react-navigation'
import Entypo from 'react-native-vector-icons/Entypo';

let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;

export default class OrderConfirmation extends Component {
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
                <View style={styles.headerView}>
                    <TouchableOpacity style={{ alignSelf: 'center' }}
                        onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    >
                        <Entypo name="menu" size={30} color="#fff" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Order Confirmation</Text>
                    <TouchableOpacity
                    >
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                        <View style={{height:SCREENHEIGHT * 0.15, borderWidth:0, justifyContent:'center', alignItems:'center', backgroundColor:'#fff'}}>
                            <Text style={{color:'#5225b5', fontSize:30}}>Congratulations !</Text>
                        </View>
                        <View>
                            <Text style={{color:'#000', fontWeight:'200', alignSelf:'center', textAlign:'center', fontSize:16,}}>Your redemption request has been submitted successfully !</Text>
                            <Text style={{fontSize:18, fontWeight:'400', color:'#000', alignSelf:'center', textAlign:'center' }}>Ref #  <Text style={{fontSize:16, fontWeight:'600', color:'#000', }}>{this.props.navigation.state.params.ReferenceNo}</Text></Text>
                        </View>
                        <View style={{ justifyContent: 'center', margin: 10, borderWidth:0 }}>
                            <ImageBackground
                                source={require('../assets/band.png')}
                                style={{ height: 30, width: 150, alignSelf: 'center' }}
                            >
                            <Text style={{ color: '#fff', position: 'absolute', fontSize: 14, alignSelf: 'center', marginBottom: 0 }}>{this.props.navigation.state.params.Points} Points</Text>
                            </ImageBackground>
                        </View>
                        <View>
                               <Image 
                                source={{ uri: this.props.navigation.state.params.ImageURL }}
                                style={{ height: 100, width: 100, alignSelf: 'center', }}
                                borderWidth={50}
                                opacity={10}
                               />
                        </View>
                        <View style={{justifyContent:'center', alignItems:'center', }}>
                            <Text style={{fontSize:12, color:'#5225b5'}}>{this.props.navigation.state.params.Itemname}</Text>
                            <Text style={{fontSize:12, color:'#000'}}>Code : {this.props.navigation.state.params.GiftReference}</Text>
                        </View>
                        <View>
                            <Text style={{color:'#000', fontWeight:'200', alignSelf:'center', textAlign:'center', fontSize:18, marginTop:10 }}>You can view the dispatch details from Redemption History</Text>
                        </View>
                        <View>
                            <TouchableOpacity 
                                style={{height:40, justifyContent:'center', alignItems:'center',backgroundColor:'#5225b5', margin:20, borderRadius:7 }}
                                onPress={() => this.props.navigation.navigate('CatalogueHistory', {
                                    VerifyRedeemtionOTP: true
                                })}
                            >
                                <Text style={{ color:'#fff', }}> Redemption History</Text>
                            </TouchableOpacity>
                        </View>
                </View>
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