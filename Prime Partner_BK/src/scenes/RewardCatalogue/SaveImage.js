import React from 'react';
import { Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View, Dimensions, BackHandler, Modal, Alert, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';
// import baseUrl from '../Constants/Constants';
import {baseUrlProdMiddleware} from '../Constants/production';
var parseString = require('xml2js').parseString;
import { NavigationEvents } from 'react-navigation';

let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;
export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      imageData: null,
      loading: false,
      modalVisible: false,
    }
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }
  resetState = ()=>{
    this.setState({
      avatarSource: null,
      imageData: null,
      loading: false,
      modalVisible: false,
    })
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.resetState();
  }
  handleBackPress = () => {
    this.props.navigation.navigate('ChemistSignature');
    return true;
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    console.log("this.props.navigation.state.params.OrderReference", this.props.navigation.state.params.OrderReference);
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: 'data:image/jpeg;base64,'+response.data};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          imageData:response.data
        });
      }
    });
  }

  saveImage = () => {
    this.setState({ loading: true }, () => this.setModalVisible(!this.state.modalVisible));
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { id, ChemistCardNo, } = User.ref;
      const details = {
        'Memberid': ChemistCardNo,
        'Type': 3,
        'Referenceid': this.props.navigation.state.params.OrderReference,
        'File': this.state.imageData
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
      var _that = this;
      fetch(baseUrlProdMiddleware + '/SaveSignature', options)
        .then(res => res.text())
        .then(res => {
                   
          console.log("SaveSignature:", res);
          this._UpdateOrderDeliveryByOrderReference();
          // parseString(res, async (err, result) => {
          //   console.log("result", result);
           
          // })
        })
        .catch((err) => {
          this.setState({ loading: false }, () => this.setModalVisible(false));
          console.log('error:', err);
          Alert.alert(  
              'Prime Partner',
              'Something went wrong Please restart the app!',
              [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false },
          );
        })
    }
  }

  _UpdateOrderDeliveryByOrderReference = ()=>{
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);

      const details = {
        'OrderReference': this.props.navigation.state.params.OrderReference,
        'ChemistSignature': this.props.navigation.state.params.ChemistSignature,
        'PSRSignature': this.props.navigation.state.params.PSRSignature,
        'Image': this.state.imageData
      }
      console.log(" _UpdateOrderDeliveryByOrderReference details", details)
      const Body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

      const options = {
        method: 'POST',
        body: Body,
        headers: {
          'Accept': 'multipart/form-data',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      var _that = this;
      fetch(baseUrlProdMiddleware + '/UpdateOrderDeliveryByOrderReference', options)
        .then(res => res.text())
        .then(res => {
          this.setState({ loading: false }, () => this.setModalVisible(!this.state.modalVisible));   
          console.log("_UpdateOrderDeliveryByOrderReference:", res);
          this.props.navigation.navigate("HomeTABS");
          parseString(res, async (err, result) => {
            console.log("result", result);
          })
        })
        .catch((err) => {
          this.setState({ loading: false }, () => this.setModalVisible(false));
          console.log('error:', err);
          Alert.alert(  
              'Prime Partner',
              'Something went wrong Please restart the app!',
              [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false },
          );
        })
  }

  render() {
    return (
      <View style={styles.container}>
      <NavigationEvents onDidFocus={() => this.resetState()}/>
        <View style={styles.headerView}>
            <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Photograph</Text>
        </View>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View
            style={[styles.avatarContainer, {marginBottom: 20}]}>
            {this.state.avatarSource == null ? (
              null
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity style={{height:40, width:100, justifyContent:'center', alignItems:'center', backgroundColor:'#6633cc', margin:2, borderBottomLeftRadius:10, borderTopLeftRadius:10, }}
                    onPress={() => this.setState({
                        avatarSource: null,
                    })}
                >
                    <Text style={{color:'#fff'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{height:40, width:100, justifyContent:'center', alignItems:'center', backgroundColor:'#6633cc', margin:2}}
                    onPress={this.selectPhotoTapped.bind(this)}
                >
                    <Text style={{color:'#fff'}}>Select Image</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                 onPress={() => {
                   if(this.state.avatarSource != null){
                      this.saveImage()
                   }else{
                     Alert.alert(
                       'Prime Partner',
                       'Please Select the Image',
                       [
                         { text: 'OK', onPress: () => console.log('OK Pressed') },
                       ],
                       { cancelable: false },
                     );
                   }
                   }}
                style={{height:40, width:100, justifyContent:'center', alignItems:'center', backgroundColor:'#6633cc', margin:2, borderBottomRightRadius:10, borderTopRightRadius:10 }}>
                    <Text style={{color:'#fff'}}>Save</Text>
                </TouchableOpacity>
      </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalView}>
            <ActivityIndicator style={styles.spinner} size="large" color="#0000ff" />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    // borderRadius: 75,
    width: SCREENWIDTH-20,
    height: SCREENHEIGHT/2,
  },
  headerView:{
    height:SCREENHEIGHT * 0.06,
    backgroundColor:'#6633cc',
    paddingLeft:10,
    paddingRight:10,
    justifyContent:'center',
    alignItems:'center',
  },
  spinner: {
    alignSelf: 'center'
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
});