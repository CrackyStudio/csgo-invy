import React from 'react';
import { View, Image, TextInput, ActivityIndicator, Clipboard, Keyboard, Text } from 'react-native';
import Style from '../../styles/home'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            fetching: false,
            loadingPhase: ''
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
                {this.loading()}
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
        clipboardContent = clipboardContent.replace(/https:\/\/steamcommunity.com\//g,'');
        this.setState({
            input: clipboardContent,
        });
        this.getJSON();
    }

    loading() {
        if (this.state.fetching) {
            return(
                <View style={Style.loadingContainer}>
                    <Text style={Style.loadingText}>Loading, please wait...</Text>
                    <ActivityIndicator style={Style.loadingIndicator} size="large" color='#0ae'/>
                    <Text style={Style.loadingText}>{this.state.loadingPhase}</Text>
                </View>
            )
        }
    }

    getJSON = async () => {
        this.setState({
            fetching: true,
            loadingPhase: 'Fetching your Steam inventory'
        });
        const lastChar = this.state.input.substr(this.state.input.length - 1);
        let URL;
        if (lastChar != '/') {
            URL = `https://steamcommunity.com/${this.state.input}/inventory/json/730/2`;
        } else {
            URL = `https://steamcommunity.com/${this.state.input}inventory/json/730/2`;
        }
        try {
            let response = await fetch(
                URL, 
                {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "GET",
                });
            let responseJson = await response.json();
            this.getOwnedItems(responseJson);
        } catch (error) {
            console.error(error);
        }
    }

    getOwnedItems(json) {
        this.setState({
            loadingPhase: 'Arraying your owned items'
        });
        let myJSON = [];
        myJSON.push(json);
        let ownedItems = [];
        myJSON.forEach(() => {      
            myJSON.find((item) => {
                for (let items in item.rgDescriptions) {
                    let vanillaName = item.rgDescriptions[items].market_hash_name
                    ownedItems.push(vanillaName.replace(/\s(\(Minimal Wear\))|\s(\(Field-Tested\))|\s(\(Battle-Scarred\))|\s(\(Well-Worn\))|\s(\(Factory New\))|StatTrak™\s|★\s/g, ''))
                }
                return ownedItems;
            })
        })
        //this.getMissingSkins(ownedItems)
    }
}