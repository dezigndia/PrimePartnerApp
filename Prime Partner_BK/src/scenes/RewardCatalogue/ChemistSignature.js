import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, BackHandler, Modal, Alert, ActivityIndicator, } from 'react-native';
import Signature from 'react-native-signature-canvas';

import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';
// import baseUrl from '../Constants/Constants';
import {baseUrlProdMiddleware} from '../Constants/production';
var parseString = require('xml2js').parseString;

let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;
export default class ChemistSignature extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      signature: null,
      ChemistSignature:null,
      loading:false,
      modalVisible: false,
    };
  }

  handleSignature = signature => {
    this.setState({ signature });
    // this.props.navigation.navigate("SaveImage")
    let ChemistSignature = signature.replace(/^data:image\/[a-z]+;base64,/, "");
    this.setState({
      ChemistSignature: ChemistSignature
    }, () => this.saveSignature())
    console.log("signature", ChemistSignature);
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  saveSignature = () => {
    this.setState({ loading: false }, () => this.setModalVisible(!this.state.modalVisible));   
    const dbState = getState().data;
    const sess = orm.session(dbState);
    console.log("sess", sess);
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { id, ChemistCardNo, mobile } = User.ref;
      const details = {
        'Memberid': ChemistCardNo,
        'Type': 2,
        'Referenceid': this.props.navigation.state.params.OrderReference,
        'File': this.state.ChemistSignature
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
          this.setState({ loading: false }, () => this.setModalVisible(!this.state.modalVisible));         
          console.log("data:", res);
          this.props.navigation.navigate("SaveImage",{
            OrderReference: this.props.navigation.state.params.OrderReference,
            PSRSignature: this.props.navigation.state.params.PSRSignature,
            ChemistSignature:this.state.ChemistSignature
          })
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
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      this.setState({ 
        signature: null,
        ChemistSignature:null,
        loading:false,
        modalVisible: false,
      })
    }
    handleBackPress = () => {
        // alert("ChemistSignature");
        this.props.navigation.navigate('PSRSignature');
        // return true;
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        console.log("this.props.navigation.state.params.OrderReference", this.props.navigation.state.params.OrderReference);
    }
  render() {
    const style = `.m-signature-pad--footer
    .button {
      background-color: #6633cc;
      color: #FFF;
      border:2
    }`;
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={styles.headerView}>
          <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Chemist Signature</Text>
        </View> */}
        <Signature
          onOK={this.handleSignature}
          descriptionText="Sign"
          clearText="Clear"
          confirmText="Save"
          webStyle={style}
        />
        {/* <View style={{height:SCREENHEIGHT * 0.06,
    backgroundColor:'#6633cc',
    paddingLeft:10,
    paddingRight:10,
    justifyContent:'center',
    alignItems:'center',}}>
            
        </View> */}
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
        <View style={styles.headerView}>
          <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Chemist Signature</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10
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