import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler, Dimensions } from 'react-native'
import { BarChart, } from 'react-native-chart-kit'
 
let SCREENWIDTH = Dimensions.get('screen').width;
let SCREENHEIGHT = Dimensions.get('screen').height    ;
const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      data: [ 20, 45, 28, -80, 99, 43 ]
    }]
}

const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2 // optional, default 3
  }
export default class Trend extends Component {
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
                <BarChart
                    style={{flex:1}}
                    data={data}
                    width={SCREENWIDTH}
                    height={SCREENHEIGHT}
                    yAxisLabel={'$'}
                    chartConfig={chartConfig}
                />
            </View>
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