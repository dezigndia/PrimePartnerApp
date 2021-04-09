import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, Image, SafeAreaView } from 'react-native'
import {
    Button, Text, Footer, FooterTab,Header,Icon
  } from 'native-base';
  import {
    DrawerActions, NavigationActions
  } from 'react-navigation'
export default class TabBar extends React.PureComponent {
  render() {
    const props = this.props;
    const { index } = props.navigation.state;
    return (
      <SafeAreaView>
      <Header style={{backgroundColor: '#6633cc',}}>
        <FooterTab style={{borderWidth:0, backgroundColor: '#6633cc',}}>
          <TouchableOpacity style={{backgroundColor:'transparent', alignSelf:'center', borderWidth:0 , height:50, justifyContent:'center', alignItems:'center' }}
            onPress={()=> props.navigation.dispatch(DrawerActions.toggleDrawer())}
          >   
            
                {/* <Text style={{color:'#fff'}}>Menu</Text> */}
                <MaterialIcons
                onPress={()=> props.navigation.dispatch(DrawerActions.toggleDrawer())}
                color="white" size={20} name="menu"
                />
          </TouchableOpacity>
          <Button
            vertical active={index === 0}
            style={{backgroundColor: '#6633cc',}}
            onPress={() => props.navigation.navigate('MyAccount')}
            // onPress={() => props.navigation.reset([NavigationActions.navigate({ routeName: 'MyAccount' })], 0)}
          >
            <Image
              source={(require('../assets/Icons-03.png'))}
              style={{height:30,width:30,resizeMode:"contain"}}
            />
            <Text>MyAccount</Text>
          </Button>
          <Button
            vertical active={index === 1}
            onPress={() => props.navigation.navigate('HomeTABS')}
            style={{backgroundColor: '#6633cc',}}
          >
            <Image
              source={(require('../assets/primelog-w.png'))}
              style={{height:30,width:30,resizeMode:"contain"}}
            />
            <Text>Prime Partner</Text>
          </Button>
          <Button
            vertical active={index === 2}
            style={{backgroundColor: '#6633cc',}}
            onPress={() => props.navigation.navigate('EarnPoints')}
          >
            <Image
              source={(require('../assets/Icons-03.png'))}
              style={{height:30,width:30,resizeMode:"contain"}}
            />
            <Text>EarnPoints</Text>
          </Button>
        </FooterTab>
      </Header>
      </SafeAreaView>
    );
  }
  }

