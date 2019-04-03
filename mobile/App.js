import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './src/screens/Home'
import Weapons from './src/screens/Weapons'

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home
  },
  Weapons: {
    screen: Weapons
  }
},
{
  initialRouteName: 'Weapons',
  headerMode: 'none'
});

export default createAppContainer(AppNavigator);