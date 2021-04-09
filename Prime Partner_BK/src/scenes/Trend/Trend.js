import React from 'react';
import { AppRegistry, StyleSheet, Text, View, processColor, BackHandler, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import {baseUrlProdMiddleware} from '../Constants/production';
import {BarChart} from 'react-native-charts-wrapper';
var parseString = require('xml2js').parseString;

import * as ActionTypes from '../../data/actionTypes';
import orm from 'src/data';
import { getState } from 'src/storeHelper';

import Entypo from 'react-native-vector-icons/Entypo';
import { DrawerActions, NavigationAction } from 'react-navigation'

let SCREENWIDTH= Dimensions.get('screen').width;
let SCREENHEIGHT= Dimensions.get('screen').height;
class Trend extends React.Component {

  constructor() {
    super();
    this.state = {
      loading:true,
      error:false,
    };
  }
 
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress = () => {
    this.props.navigation.navigate('HomeTABS');
    // this.goBack(); // works best when the goBack is async
    return true;
  }
  componentDidMount= async()=> {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    console.log("this.props.navigation", this.props,);
    this.setState({...this.state, highlights: [{x: 1, y:40}, {x: 2, y:50}]})
    const dbState = getState().data;
    const sess = orm.session(dbState);    
        
    if (sess.User.idExists(0)) {
      const User = sess.User.withId(0);
      const { id, ChemistCardNo, } = User.ref;
    const details = {
      'MemberLogin': ChemistCardNo,
      // 'MemberLogin': '23300020',
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
    fetch(baseUrlProdMiddleware + '/GetTrendOfChemistMonthWise', options)
      .then(res => res.text())
      .then(res => {

        console.log("res",res);
        let PointsEarned=[];
        let PointsRedemeed=[];
        let Month=[];
        let Year=[];
        _that=this;
         parseString(res, async(err, result)=> {
        // console.log("(result.DataSet['diffgr:diffgram']",result.DataSet["diffgr:diffgram"][0]);
          //  if(result.DataSet["diffgr:diffgram"][0].DataSet["diffgr:diffgram"]==undefined){
           
            // console.log("result", result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table);

           

            try{
              await result.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table.map((item, index)=>{
                console.log("data:", item.Month[0]);    
                Month.push(item.Month[0]) ;
                PointsRedemeed.push(parseInt(item.PointsRedemeed[0]))       
                PointsEarned.push(parseInt(item.PointsEarned[0]))       
                Year.push(parseInt(item.Year[0]))       
             })
            _that.setState({
              data:{
                dataSets: [{
                  values: PointsEarned,
                  label: 'Point Earned',
                  config: {
                    drawValues: false,
                    colors: [processColor('red')],
                  }
                }, {
                  values: PointsRedemeed,
                  label: 'Point Redeemed',
                  config: {
                    drawValues: false,
                    colors: [processColor('blue')],
                  }
                },
              ],
                config: {
                  barWidth: 0.2,
                  group: {
                    fromX: 0,
                    groupSpace: 0.2,
                    barSpace: 0.2,
                  },
                }
              },
              xAxis: {
                valueFormatter: Month,
                granularityEnabled: true,
                granularity: 1,
                axisMaximum: 5,
                axisMinimum: 0,
                centerAxisLabels: true
              },
              legend: {
                enabled: true,
                textSize: 16,
                form: "SQUARE",
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                wordWrapEnabled: true
              },
              marker: {
                enabled: true,
                markerColor: processColor('#4a4a4a'),
                textColor: processColor('#fff'),
                markerFontSize: 18,
              },
            },
            ()=>{
              _that.setState({loading:false})
            }
            )
            }catch(e){
              this.setState({error:true, loading:false})
              console.log("e",e);
            }
             
            
          // }else{
          //     this.setState({error:true, loading:false})
          // }
        }); 
        

        console.log('PointsEarned',PointsEarned , "PointsRedemeed", PointsRedemeed, "Month", Month, "Year", Year)
      })
      .catch((err => {
        this.setState({error:true, loading:false})
        console.log("err", err)
      }))
    }
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }

    console.log(event.nativeEvent)
  }

  render() {
    return (
      <View style={{flex: 1}}>

        {/* <View style={{height:80}}>
          <Text> selected entry</Text>
          <Text> {this.state.selectedEntry}</Text>
        </View> */}
        <View style={styles.headerView}>
                    <TouchableOpacity style={{ alignSelf: 'center' }}
                        onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
                    >
                        <Entypo name="menu" size={30} color="#fff" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', alignSelf: 'center', fontSize: 18 }}>Trend</Text>
                    <TouchableOpacity
                    >
                    </TouchableOpacity>
                </View>
        <View style={styles.container}>
        {
          !this.state.loading && !this.state.error &&<BarChart
            style={styles.chart}
            xAxis={this.state.xAxis}
            data={this.state.data}
            legend={this.state.legend}
            drawValueAboveBar={false}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
            highlights={this.state.highlights}
            marker={this.state.marker}
          />    
        }
         {
          this.state.loading &&<ActivityIndicator size='large' color='#6633cc'/>
         }
        {
           this.state.error &&<Text style={{alignSelf:'center', textAlign:'center', color:'#000'}}>something went wrong !</Text>
        }
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent:'center'
  },
  chart: {
    flex: 1
  },
  headerView:{
    height:SCREENHEIGHT * 0.06,
    backgroundColor:'#6633cc',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingLeft:10,
    paddingRight:10,

}
});


export default Trend;