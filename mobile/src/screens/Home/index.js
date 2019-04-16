import React from 'react';
import { View, Image, TextInput, ActivityIndicator, Clipboard, Keyboard, Text, AsyncStorage, Button } from 'react-native';
import Style from '../../styles/home'
import skinsList from '../../databases/skinsList.json'

let weaponList = ["AK-47", "AUG", "AWP", "Bayonet", "Bowie Knife", "Butterfly Knife", "CZ75-Auto", "Desert Eagle", "Dual Berettas", 
"Falchion Knife", "FAMAS", "Five-SeveN", "Flip Knife", "G3SG1", "Galil AR", "Glock-18", "Gut Knife", "Huntsman Knife", "Karambit", 
"M249", "M4A1-S", "M4A4", "M9 Bayonet", "MAC-10", "MAG-7", "MP5-SD", "MP7", "MP9", "Navaja Knife", "Negev", "Nova", "P2000", "P250", "P90", "PP-Bizon", 
"R8 Revolver", "Sawed-Off", "SCAR-20", "SG 553", "Shadow Daggers", "SSG 08", "Stiletto Knife", "Talon Knife", "Tec-9", "UMP-45", "Ursus Knife", "USP-S", "XM1014"];

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            fetching: false,
            loadingPhase: '',
            loadingPhaseString: '',
            missingWeaponSkinsArray: [],
            firstLaunch: true,
            isError: "none",
            previousUser: null,
        }
        this.restoreData()
    }
    
    render() {
        return (
            <View style={Style.container}>
                <View style={Style.logoContainer}>
                    <Image style={Style.logo} source={require('../../images/CS-icon.png')}/>
                </View>
                <View style={Style.mainContainer}>
                    {this.getPreviousUser()}
                    {this.loading()}
                    {this.badURL()}
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
                    <Text style={Style.loadingText}>{this.state.loadingPhaseString}</Text>
                </View>
            )
        }
    }

    getJSON = async () => {
        this.setState({
            fetching: true,
            loadingPhase: '1/3',
            loadingPhaseString: 'Fetching your Steam inventory',
            isError: "none"
        });
        const lastChar = this.state.input.substr(this.state.input.length - 1);
        let URL;
        if (lastChar != '/') {
            URL = `https://steamcommunity.com/${this.state.input.replace(/ /g,'')}/inventory/json/730/2`;
        } else {
            URL = `https://steamcommunity.com/${this.state.input.replace(/ /g,'')}inventory/json/730/2`;
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
            this.storeData(URL.replace(/\/inventory\/json\/730\/2/g, ''))
            this.getOwnedItems(responseJson);
        } catch {
            this.clearState("badURL");
        }
    }

    getOwnedItems(json) {
        this.setState({
            loadingPhase: '2/3',
            loadingPhaseString: 'Arraying your owned items'
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
        this.getMissingSkins(ownedItems)
    }

    getMissingSkins(ownedItems) {
        this.setState({
            loadingPhase: '3/3',
            loadingPhaseString: 'Searching missing skins'
        });
        let missingSkinsArray = [];
        let itemsListFile = skinsList;
        for(let i = 0; i < itemsListFile.length; i++) {
            if(!(ownedItems.indexOf(itemsListFile[i]) >= 0)) {
                missingSkinsArray.push(itemsListFile[i])
            }
        }
        weaponList.forEach((weapon) => {
            for(let i = 0; i < missingSkinsArray.length; i++) {
                if(missingSkinsArray[i].indexOf(weapon) >= 0) {    
                  this.state.missingWeaponSkinsArray.push(missingSkinsArray[i])      
                }
            }
        }, this);
        this.setState({
            firstLaunch: false
        });
        this.props.navigation.navigate('Weapons', this.state.missingWeaponSkinsArray)
        this.clearState("none")
    }

    clearState(isError) {
        this.setState({
            input: '',
            fetching: false,
            loadingPhase: '',
            loadingPhaseString: '',
            missingWeaponSkinsArray: [],
            firstLaunch: true, 
            isError,
        });
    }

    badURL() {
        if (this.state.isError == "badURL") {
            return(
                <View style={Style.loadingContainer}>
                    <Text style={Style.errorText}>Bad URL, please verify your Steam URL.</Text>
                </View>
            )
        }
    }

    storeData = async (user) => {
        try {
            await AsyncStorage.setItem('previousUser', user);
            this.setState({
                previousUser: user 
            });
        } catch (error) {
            throw error
        }
    }
    
    restoreData = async () => {
        try {
            const user = await AsyncStorage.getItem('previousUser');
            if (user !== null) {
                this.setState({
                    previousUser: user 
                });
            }
        } catch (error) {
            throw error
        }
    }

    setPreviousUser = async () => {
        await this.setState({
            input: this.state.previousUser.replace(/https:\/\/steamcommunity.com\//g,'')
        });
        this.getJSON();
    }

    getPreviousUser() {
        if (this.state.previousUser !== null) {
            return(
                <View style={Style.loadingContainer}>
                    <Text style={Style.loadingText}>Fetch last account fetched?</Text>
                    <View style={Style.buttonsContainer}>
                        <View style={Style.leftButtonContainer}>
                            <Button title="Yes" onPress={()=>{this.setPreviousUser()}}/>
                        </View>
                        <View style={Style.rightButtonContainer}>
                            <Button title="No" color="#EC4C47" onPress={()=>{
                                    this.setState({
                                        previousUser: null 
                                    });
                                }}/>
                        </View>
                    </View>
                </View>
            )
        } else {
            return(
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
            )
        }
    }
}