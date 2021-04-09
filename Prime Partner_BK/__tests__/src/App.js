import React from 'react';
import { ImageBackground } from 'react-native';
import { Provider } from 'react-redux';
import { Root, StyleProvider } from 'native-base';
import store from 'src/store';

import AppWithNavigationState from './navigators/Navigators';

console.disableYellowBox = true;

class App extends React.Component {
  render() {
    return (
      <Root>
        <Provider store={store}>

            <AppWithNavigationState />

        </Provider>
      </Root>
    );
  }
}



export default App;
