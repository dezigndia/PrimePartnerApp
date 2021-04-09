import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, SafeAreaView, ImageBackground, Image, TextInput, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';

let SCREENWIDTH= Dimensions.get('screen').width;
let SCREENHEIGHT= Dimensions.get('screen').height;
export default class Logout extends Component {
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
            <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.context}> Logout </Text>
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