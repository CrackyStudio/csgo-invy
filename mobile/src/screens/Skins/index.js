import React from 'react';
import { View, Text, Image, ScrollView, Button, Linking } from 'react-native';
import Style from '../../styles/skins'
import skinsAPI from '../../databases/skins.json'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weapon: this.props.navigation.state.params.weaponName,
            missingWeaponSkinsArray: this.props.navigation.state.params.missingWeaponSkinsArray
        }
    }
    
    render() {
        return (
            <View style={Style.container}>
                <ScrollView contentContainerStyle={Style.mainContainer}>
                    {this.buildSkinsList()}
                </ScrollView>
            </View>
        );
    }

    buildSkinsList() {
        let weapon = this.state.weapon;
        let index = 0;
        return this.state.missingWeaponSkinsArray.map(item => {
            if (item.replace(new RegExp(` \\|(.*)`, "g"), "") === weapon) {
                let skin = item.replace(new RegExp(`${weapon} \\| `, "g"), "");
                if (skinsAPI[weapon][skin] !== undefined) {
                    let validImage = "";
                    if (skinsAPI[weapon][skin]["Factory New"]["image"] !== "Error") {
                        validImage = skinsAPI[weapon][skin]["Factory New"]["image"]
                    } else {
                        if (skinsAPI[weapon][skin]["Minimal Wear"]["image"] !== "Error") {
                        validImage = skinsAPI[weapon][skin]["Minimal Wear"]["image"]
                        } else {
                        if (skinsAPI[weapon][skin]["Field-Tested"]["image"] !== "Error") {
                            validImage = skinsAPI[weapon][skin]["Field-Tested"]["image"]
                        } else {
                            if (skinsAPI[weapon][skin]["Well-Worn"]["image"] !== "Error") {
                            validImage = skinsAPI[weapon][skin]["Well-Worn"]["image"]
                            } else {
                            validImage = skinsAPI[weapon][skin]["Battle-Scarred"]["image"]
                            }
                        }
                    }
                }
                index +=1;
                return (
                    <View key={index} style={Style.skinContainer}>
                        <Text style={Style.Text}>{skin}</Text>
                        <Image style={Style.Image} source={{uri: validImage}}/>
                        <Button title="Buy" onPress={ ()=>{ Linking.openURL(skinsAPI[weapon][skin]["Compare"]["buyLink"])}} />
                    </View>
                )}
            } else {
                return null
            }
        })
    }
}