import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions, TouchableOpacity, Linking, ScrollView, Alert, Modal, ActivityIndicator, ToastAndroid } from 'react-native'
import { DrawerActions, NavigationAction, NavigationEvents } from 'react-navigation'
import Entypo from 'react-native-vector-icons/Entypo';
import baseUrl from '../Constants/Constants';
import { baseUrlProd, baseUrlProdMiddleware } from "../Constants/production";
import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper'

let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;

export default class ContactUs extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            Balance:'',
            RedeemToPoints:'',
            mobile:'',
            modalVisible: false,
            loading:true
        }
    }
    
    componentDidMount() {
        console.log("this.props.navigation.state.params.Points", this.props.navigation.state.params.Points);
        console.log("this.props.navigation.state.params.GiftReference", this.props.navigation.state.params.GiftReference);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        // const dbState = getState().data;
        // const sess = orm.session(dbState);    
        // console.log("sess",sess);
        //  if (sess.User.idExists(0)) {
        //   const User = sess.User.withId(0);
        //   const { id, Balance} = User.ref;
        //   this.setState({
        //       Balance:parseInt(Balance),
        //       RedeemToPoints:parseInt(this.props.navigation.state.params.Points)
        //   })
            
        //  }
    }



    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.props.navigation.navigate('RewardCatalogue');
        // this.props.navigation.goBack();
        // this.goBack(); // works best when the goBack is async
        return true;
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    _getOTP = ()=>{
        const dbState = getState().data;
        const sess = orm.session(dbState);    
        console.log("sess",sess);
         if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, Balance, mobile} = User.ref;
            console.log('mobile', mobile)
            if(mobile==='' || mobile==undefined){
                this.setState({ loading: false }, () => this.setModalVisible(false))
                ToastAndroid.show("something went wrong! please Re-Login", ToastAndroid.SHORT);
                return;
            }
        const details={
            'Mobile': mobile,
            'RefralCode':'getOTP',
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
      
      fetch(baseUrlProdMiddleware+'/GetOTP', options)
        .then(res =>res.text())
        .then(res => {
            this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible));
           
                data=JSON.parse(res)
                console.log(":res",data[0].OTP)
                // alert('otp is:'+data[0].OTP);
                this.props.navigation.navigate('VerifyRedeemtionOTP',{
                    mobile:mobile,
                    GiftReference:this.props.navigation.state.params.GiftReference,
                    Points:this.props.navigation.state.params.Points,
                    Itemname:this.props.navigation.state.params.Itemname,
                    ImageURL:this.props.navigation.state.params.ImageURL,
                })
            
        })
        .catch((err)=>{
            this.setState({loading:false},()=>this.setModalVisible(!this.state.modalVisible));
            console.log('error',err)
        })
    }else{
        ToastAndroid.show("something went wrong! please try again", ToastAndroid.SHORT);
        return;
    }
    }
    _onDidFocus = ()=>{
        console.log('I am triggered', this.props.navigation.state.params.Points)
        const dbState = getState().data;
        const sess = orm.session(dbState);    
        console.log("sess",sess);
         if (sess.User.idExists(0)) {
          const User = sess.User.withId(0);
          const { id, Balance, mobile} = User.ref;
          this.setState({
              Balance:parseInt(Balance),
              RedeemToPoints:parseInt(this.props.navigation.state.params.Points),
              mobile:mobile
          })
            
         }
    }

    render() {
        return (
            <View style={styles.container}>
             <NavigationEvents onDidFocus={() => this._onDidFocus() }/>
                <View style={styles.headerView}>
                    <TouchableOpacity style={{ alignSelf: 'center' }}
                        onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    >
                        <Entypo name="menu" size={30} color="#fff" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Redemption Confirmation</Text>
                    <TouchableOpacity
                    >
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View>
                        <Text style={{margin:20, textAlign:'center', fontSize:18, color:'#000', fontWeight:'300'}}>
                            Your Reward will be dispatched to Dr. Reddy's Representative, who will handover the Reward to you.
                        </Text>
                    </View>
                    <View style={{ borderWidth:0, marginLeft:20, marginRight:20, backgroundColor:'#cbcbcb', padding:10, borderRadius:5 }}>
                        <Text style={{color:'#000', fontSize:18, fontWeight:'600'}}>Current Balance</Text>
                        <Text style={{ fontSize:18, fontWeight:'600'}}>{this.state.Balance}</Text>
                        <Text style={{color:'#000', fontSize:18, fontWeight:'600'}}>Point to be Redeemed</Text>
                        <Text style={{ fontSize:18, fontWeight:'600'}}>{this.state.RedeemToPoints}</Text>
                        <Text style={{color:'#000', fontSize:18, fontWeight:'600'}}>Balance After Redemption</Text>
                        <Text style={{ fontSize:18, fontWeight:'600'}}>{this.state.Balance - this.state.RedeemToPoints}</Text>
                    </View>
                    <TouchableOpacity 
                        style={{ marginLeft:30, marginRight:30, marginTop:20, marginBottom:10, backgroundColor:'#5225b4', height:50, borderRadius:10, justifyContent:'center', alignItems:'center' }}
                        onPress={()=>{
                            if (this.state.Balance - this.state.RedeemToPoints < 0) {
                                
                                Alert.alert(
                                    'Prime Partner',
                                    'Insufficient balance',
                                    [
                                        { text: 'OK', onPress: () => this.props.navigation.navigate('HomeTAB') },
                                    ],
                                    { cancelable: false },
                                );
                            } else {
                                this.setModalVisible(!this.state.modalVisible)
                                this._getOTP();
                            }
                            // this.setModalVisible(!this.state.modalVisible)
                            // this._getOTP();
                        }}
                    >
                        <Text style={{color:'#fff', fontSize:18}}>Redemption Confirm </Text>
                    </TouchableOpacity>
                    <Text style={styles.body}>1)	Physical gifts will be delivered to the member by Dr. Reddy’s Representative, while non-physical gifts will be delivered directly to the member.</Text>
                    <Text style={styles.body}>2)	All branded items will be delivered with a valid warranty card. In case of any malfunction, the items can be serviced at the nearby service center of the particular brand. Dr. Reddy’s shall not be responsible for servicing any product.</Text>
                    <Text style={styles.body}>3)	All gift vouchers will be dispatched with a minimum validity of 45 days before the expiry date. The vouchers are maintained as stocks and dispatched against redemptions and hence complete validity cannot be guaranteed. Member has to use the gift voucher before expiry date.</Text>
                    <Text style={styles.body}>4)	All items in the catalogue are subject to availability. Any redeemed item, if not available will be will be replaced with an equivalent alternate after approval from the member. In the absence of an equivalent alternate, the member will be intimated and points will be credited back.</Text>
                    <Text style={styles.body}>5)	Pictures used in the catalogue are for representation purpose only. Actual products and their colors/ models may vary.</Text>
                    <Text style={styles.body}>6)	The catalogue may get revised with new items and replacement for obsolete items.</Text>
                    <Text style={styles.body}>7)	Minimum time required to deliver the redeemed gift would be 21 days. However, delays can occur due to internal validations, product not available or logistic reasons.</Text>
                    <Text style={styles.body}>8)	Dr. Reddy’s reserves the right to validate the authenticity of purchase of the chemist.</Text>
                    <Text style={styles.body}>10)	Members can earn points or redeem valid points as long as they are registered member of Prime Partner Program. In case of termination of membership for whatever reason, all points shall lapse/expire.</Text>
                    <Text style={styles.body}>11)	Dr. Reddy’s shall not be liable in any way for loss, damage or delay caused by any event or circumstances beyond their reasonable control. The following events may be considered as Force Majeure events under these Terms and Conditions: Explosion, fire, flood, earthquake, storm or other natural calamity or act of God, strike or other labor dispute, war, insurrection or riot, acts of or failure to act by any governmental authority, changes in law, failure in telecommunications or other infrastructural utilities. </Text>
                    <Text style={styles.body}>12)	Dr. Reddy’s holds out no warranty or makes no representation (whether expressed or implied), about the goods and/or services manufactured/supplied by third parties that are offered as benefits to members of the program. </Text>
                    <Text style={styles.body}>13)	Prime Partner Program shall be subject to laws of India, including tax laws, rules and regulations as may be applicable. </Text>
                    <Text style={styles.body}>14)	Dr. Reddy’s reserves the right to modify or change any of the terms and conditions applicable to these offers at any given time with/without prior notice to the members. </Text>
                    <Text style={styles.body}>15)	The decision of the management of Dr. Reddy’s shall be final and binding. </Text>
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <ActivityIndicator style={{ alignSelf: 'center' }} size="large" color="#0000ff" />
                    </View>
                </Modal>
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
    body:{
        textAlign:'justify',
        color:'#000',
        marginLeft:20,
        marginRight:20,
        marginTop:3,
        marginBottom:3,
        fontWeight:'300',
        fontSize:16
    },  
})