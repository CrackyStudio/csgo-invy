import React from 'react';
import { View, Image, TextInput, Button, Clipboard, Keyboard, Text } from 'react-native';
import Style from '../../styles/home'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            steam: 'https://steamcommunity.com'
        }
    }
  
    render() {
      return (
        <View style={Style.container}>
            <View style={Style.logoContainer}>
                <Image style={Style.logo} source={require('../../images/CS-icon.png')}/>
            </View>
            <View style={Style.mainContainer}>
                <TextInput
                    style={Style.input}
                    textAlign={'center'}
                    onChangeText={(input) => this.setState({input})}
                    value={this.state.input}
                    placeholder='Click to paste Steam URL'
                    placeholderTextColor='white'
                    onFocus={() => this.clipboardToInput()}
                    selection={{start:0, end:0}} 
                />
            </View>
            <View style={Style.devContainer}>
                <View style={Style.devName}>
                    <Text style={Style.name}>Cracky Studio</Text>
                </View>
                <View style={Style.devVersion}>
                    <Text style={Style.version}>v1.0.0</Text>
                </View>
            </View>            
        </View>
      );
    }

    clipboardToInput = async () => {
        Keyboard.dismiss()
        let clipboardContent = await Clipboard.getString(); 
        clipboardContent = clipboardContent.replace(/https:\/\/steamcommunity.com/g,'');
        this.setState({ 
            input: clipboardContent,
        });
    }
}