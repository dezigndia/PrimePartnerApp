import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, TouchableOpacity, Linking } from 'react-native'
import { DrawerActions, NavigationAction } from 'react-navigation'
import Entypo from 'react-native-vector-icons/Entypo';

let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;

export default class ContactUs extends Component {
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
                    <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Contact Us</Text>
                    <TouchableOpacity
                    >
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent:'center',flex:1, alignItems:'center', borderWidth:1}}>
                    <View style={{ height:SCREENHEIGHT * 0.3 ,borderWidth:0, borderRadius:5, margin:20, justifyContent:'center', alignItems:'center' }}>
                        <Text style={{color:'#000', fontSize:16, alignSelf:'center'}}>For any programme related feedback</Text>
                        <Text style={{color:'#000', fontSize:16, alignSelf:'center'}}
                         onPress={() => Linking.openURL('tel:044 35004238') }
                        >Call-<Text style={{color:'#6633cc', fontSize:17}}> 044-35004238</Text></Text>
                        <Text style={{color:'#000', fontSize:16, alignSelf:'center'}}>(Monday to Saturday, 10 AM to 6 PM)</Text>
                        <Text style={{color:'#000', fontSize:16, alignSelf:'center'}}>OR</Text>
                        <Text style={{color:'#000', fontSize:16, alignSelf:'center'}} 
                        onPress={() => Linking.openURL('mailto:helpdesk@drlprimepartner.com?subject=Need Support') }
                        title="helpdesk@drlprimepartner.com">Email Us: <Text style={{color:'#6633cc', fontSize:17}}>
                        helpdesk@drlprimepartner.com</Text></Text>
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