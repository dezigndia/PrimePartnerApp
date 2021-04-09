import React, { Component } from 'react';
import { Text, View, StyleSheet, BackHandler, Dimensions, SafeAreaView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { DrawerActions, NavigationAction } from 'react-navigation';
let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;

export default class TierGuide extends Component {
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
    return(
        <View style={styles.container}>
            <View style={styles.headerView}>
                        <TouchableOpacity style={{ alignSelf: 'center' }}
                          onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                        >
                            <Entypo
                              name="menu" size={30} color="#fff" style={{ alignSelf: 'center' }}
                             />
                         </TouchableOpacity>
                         <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Tier Guide</Text>
                         <TouchableOpacity
                         >
                         </TouchableOpacity>
                     </View>
            <View style={{marginTop:0}}>
                <Image style={styles.imageBackground}
                    source={require('../assets/TierGuide.jpg')}
                    // source={require('../assets/TierGuide.png')}
                >
                </Image>
            </View>
        </View>
    )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff',
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
    imageBackground:{
        // flex:1,
        // width:SCREENWIDTH,
        // height:400,
        marginTop:0,
        resizeMode:'contain',
        // width:'100%', 
        // height:'85%',
        width:'97%', 
        height:'100%',
        alignSelf:'center'
        // marginLeft:10,
        // marginRight:10
        
    },
})