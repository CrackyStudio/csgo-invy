import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './src/screens/Home'
import Weapons from './src/screens/Weapons'
import Skins from './src/screens/Skins'

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home
  },
  Weapons: {
    screen: Weapons
  },
  Skins: {
    screen: Skins
  }
},
{
  initialRouteName: 'Home',
  headerMode: 'none'
});

export default createAppContainer(AppNavigator);