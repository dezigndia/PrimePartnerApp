import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, SafeAreaView, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { DrawerActions, NavigationAction } from 'react-navigation'
let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height;
export default class TermsConditions extends Component {
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
                    <View style={styles.headerView}>
                        {/* <Icon name="file-document-outline" size={30} color="#fff" style={{alignSelf:'center'}} /> */}
                        <TouchableOpacity style={{ alignSelf: 'center' }}
                            onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                        >
                            <Entypo
                                name="menu" size={30} color="#fff" style={{ alignSelf: 'center' }}
                            />
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Terms & Conditions</Text>
                        <TouchableOpacity
                        >
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, margin:10 }}>
                    <ScrollView>
                        <Text style={styles.context}> Please carefully read the following Terms & Conditions. By accessing and using the services you agree to be bound by the terms of use. In case you do not agree to be bound by the terms of use, please do not access or use the program. </Text>
                        <Text style={styles.point}> 1.	Dr. Reddy’s Laboratories Limited (Dr. Reddy’s) Loyalty Program “Prime Partner” is valid for all the Members (Chemists) who have filled the enrollment form by giving all the correct information as requested. </Text>
                        <Text style={styles.point}> 2.	Dr. Reddy’s may at its sole discretion accept or reject the application for enrolment in the Program for reasons as it deems appropriate including if the details or any part thereof provided in the enrolment form are incomplete and / or incorrect. </Text>
                        <Text style={styles.point}> 3.	Products offered under the program are neither eligible for Saleable nor for Expiry Returns. </Text>
                        <Text style={styles.point}> 4.	Points can be accrued only on the purchase of secondary packs of the selected products. </Text>
                        <Text style={styles.point}> 5.	Dr. Reddy’s reserves the right to modify or update the list of Products under this program at any point of time without any prior notice. </Text>
                        <Text style={styles.point}> 6.	Dr. Reddy’s reserves the right to terminate Prime Partner Program at any point of time. Two months notice will be given to participants before termination. The notice period will be provided to enable participants to redeem their points  </Text>
                        <Text style={styles.point}> 7.	No purchase / sale / transfer of points or benefits are permitted. The member can only earn points as per the conditions specified in the program.  </Text>
                        <Text style={styles.point}> 8.	The loyalty points shall be valid for 1 years from the date of earning.  </Text>
                        <Text style={styles.point}> 9.	Upgraded member should maintain minimum point maintenance criteria for their applicable Gold/ Platinum tier every 90 days to avoid being downgraded to the lower tier. </Text>
                        <Text style={styles.point}> 10.	Dr. Reddy’s reserve the right to modify or change any of the terms and conditions applicable to these offers at any given time with/without prior notice to the members.</Text>
                        <Text style={styles.point}> 11.	Any redeemed gift can be cancelled within 48 hrs of redemption by calling the Helpdesk. Points for the cancelled gift will be credited back to the member’s account. </Text>
                        <Text style={styles.point}> 12.	Physical gifts will be delivered to the member by Dr. Reddy’s representative, while non-physical gifts will be delivered directly to the member.</Text>
                        <Text style={styles.point}> 13.	All branded items will be delivered with a valid warranty card. In case of any malfunction, the items can be serviced at the nearby service centre of the particular brand. Dr. Reddy’s shall not be responsible for servicing any product.</Text>
                        <Text style={styles.point}> 14.	All gift vouchers will be dispatched with a minimum validity of 45 days before the expiry date. The vouchers are maintained as stocks and dispatched against redemptions and hence complete validity cannot be guaranteed. Member has to use the gift vouchers before expiry date.  </Text>
                        <Text style={styles.point}> 15.	All special offers, updates and member account activity details would be communicated through SMS. However, Dr. Reddy’s shall not be responsible in any manner for any lost, delayed, incorrect, misdirected or incomplete communication.</Text>
                        <Text style={styles.point}> 16.	The members are requested to update any change in their mobile number / address / profile from time to time by calling program helpdesk or informing the Dr. Reddy’s representative.</Text>
                        <Text style={styles.point}> 17.	Members can earn points or redeem valid points as long as they are registered members of Prime Partner Program. In case of termination of membership, for whatever reason, all points shall lapse / expire.</Text>
                        <Text style={styles.point}> 18.	Dr. Reddy’s shall not be liable in any way for loss, damage or delay caused by any event or circumstances beyond their reasonable control. The following events may be considered as examples of Force Majeure Events under these Terms and Conditions: Explosion, fire, flood, earthquake, storm, or other natural calamity or act of God, strike or other labour dispute, war, insurrection or riot, acts of or failure to act by any governmental authority, changes in law, failures of telecommunications and other infrastructural utilities. </Text>
                        <Text style={styles.point}> 19.	Prime Partner Program shall be subject to the laws of India, including tax laws, rules and regulations as may be applicable.  </Text>
                        <Text style={styles.point}> 20.	Prime Partner Program Membership account is not a payment medium or payment instrument. </Text>
                        <Text style={styles.point}> 21.	Dr. Reddy’s reserve the right to validate the member purchases through physical stock verification and / or purchase invoices and refuse to award points or refuse to redeem points accumulated, for any breach of the program terms & conditions. </Text>
                        <Text style={styles.point}> 22.	Prime Partner Program at all times remains the property of Dr. Reddy’s, which reserves the right at any time in its absolute discretion and without giving notice to such member to deactivate the Prime Partner Program Membership and in such circumstances member cannot redeem the Points, which will automatically expire. </Text>
                        <Text style={styles.point}> 23. Reddy’s holds out no warranty and makes no representation (whether expressed or implied) about the goods and / or services, manufactured / supplied by third parties that are offered as benefits to members of the program. </Text>
                        <Text style={styles.point}> 24.	The decision of the management of Dr. Reddy’s shall be final and binding. </Text>
                    </ScrollView>
                    </View>
                    <View style={styles.footerView}> 
                        <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Accept</Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },
    context:{
        textAlign:'auto',
        color:'#000',
        fontWeight:'600',
        marginBottom:10,
        fontFamily:'NunitoSans-Black'
    },
    point:{
        // alignItems:'flex-start',
        // textAlign:'left',
        // justifyContent:'flex-start',s
        textAlign:'auto',
        color:'#444',
        marginTop:5,
        marginBottom:5,
        fontFamily:'NunitoSans-Regular'
        // fontWeight:'600'
    },
    headerView:{
        height:SCREENHEIGHT * 0.06,
        backgroundColor:'#6633cc',
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:10,
        paddingRight:10,

    },
    footerView:{
        height:SCREENHEIGHT * 0.06,
        backgroundColor:'#6633cc',
        justifyContent:'center',
        paddingLeft:10,
        paddingRight:10,
    }
})