import React, { Component } from 'react'
import { Text, View, StyleSheet, ImageBackground, SafeAreaView, BackHandler } from 'react-native'
import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';
import { NavigationEvents, NavigationActions, StackActions } from 'react-navigation';
export class Splash extends Component {

    _checkLoginStatus = ()=>{
            console.log("this.props.navigation.state",this.props.navigation.state)

            if(this.props.navigation.state.params.logoutFlag!=undefined){
                const dbState = getState().data;
                const sess = orm.session(dbState);    
                console.log("sess",sess);
                console.log("this.props.navigation:",this.props.navigation);
                if (sess.User.idExists(0)) {
                  const User = sess.User.withId(0);
                  const { id, login} = User.ref;
                  this.setState({ id, login },
                    ()=>{
                        if(login==="true"){
                            // this.props.navigation.reset([NavigationActions.navigate({ routeName: 'MainTab' })], 0)
                            this.props.navigation.navigate("MainTab")
                            clearInterval(this.timer);
                        }else{
                            this.props.navigation.dispatch(StackActions.reset({index: 0, actions:[NavigationActions.navigate({routeName: 'Login'})]}))
                            
                            // this.props.navigation.navigate("Login")
                            clearInterval(this.timer);
                        }
                    }
                    );
                }else{
                    this.props.navigation.navigate("Login")
                    clearInterval(this.timer);
                }
            }
      
    }
    componentDidMount = async()=>{
        this.timer=setInterval(e=>{
            const dbState = getState().data;
            const sess = orm.session(dbState);    
            console.log("sess",sess);
            console.log("this.props.navigation:",this.props.navigation);
            if (sess.User.idExists(0)) {
              const User = sess.User.withId(0);
              const { id, login} = User.ref;
              this.setState({ id, login },
                ()=>{
                    if(login==="true"){
                        // this.props.navigation.reset([NavigationActions.navigate({ routeName: 'MainTab' })], 0)
                        // this.props.navigation.navigate("MainTab")
                        this.props.navigation.navigate("HomeTABS")
                        clearInterval(this.timer);
                    }else{
                        this.props.navigation.dispatch(StackActions.reset({index: 0, actions:[NavigationActions.navigate({routeName: 'Login'})]}))
                        
                        // this.props.navigation.navigate("Login")
                        clearInterval(this.timer);
                    }
                }
                );
            }else{
                this.props.navigation.navigate("Login")
                clearInterval(this.timer);
            }
        },2000)
    }
    componentWillUnmount(){
        console.log("componentWillUnmount");
        clearInterval(this.timer);
     }
    render() {
        return (
            <SafeAreaView style={styles.container}>
            <View style={styles.container}>
            <NavigationEvents onDidFocus={() => this._checkLoginStatus()}/>
                <ImageBackground
                    style={{height:'100%', width:'100%',resizeMode:'contain'}}
                    source={require('../assets/Splash.png')}
                >

                </ImageBackground>
            </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center'
    }
})
export default Splash
