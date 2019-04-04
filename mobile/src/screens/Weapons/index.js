import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Style from '../../styles/weapons'

let weaponList = ["AK-47", "AUG", "AWP", "Bayonet", "Bowie Knife", "Butterfly Knife", "CZ75-Auto", "Desert Eagle", "Dual Berettas", 
"Falchion Knife", "FAMAS", "Five-SeveN", "Flip Knife", "G3SG1", "Galil AR", "Glock-18", "Gut Knife", "Huntsman Knife", "Karambit", 
"M249", "M4A1-S", "M4A4", "M9 Bayonet", "MAC-10", "MAG-7", "MP5-SD", "MP7", "MP9", "Navaja Knife", "Negev", "Nova", "P2000", "P250", "P90", "PP-Bizon", 
"R8 Revolver", "Sawed-Off", "SCAR-20", "SG 553", "Shadow Daggers", "SSG 08", "Stiletto Knife", "Talon Knife", "Tec-9", "UMP-45", "Ursus Knife", "USP-S", "XM1014"];

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            missingWeaponSkinsArray: this.props.navigation.state.params
        }
    }
    
    render() {
        return (
            <View style={Style.container}>
                <ScrollView contentContainerStyle={Style.mainContainer}>
                    {this.buildWeaponList()}
                </ScrollView>
            </View>
        );
    }

    buildWeaponList() {
        return weaponList.map(weapon => (
            <View key={weapon} style={Style.weaponContainer}>
                <TouchableOpacity style={Style.dataView} onPress={() => this.props.navigation.navigate('Skins', 
                { weaponName: weapon, missingWeaponSkinsArray: this.state.missingWeaponSkinsArray })}>
                    <Text style={Style.Text}>{weapon}</Text>
                </TouchableOpacity>
            </View>
        ));
    }
}