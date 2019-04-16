const fs = require('fs');

let itemList = ["M4A4 | The Emperor", "Five-SeveN | Angry Mob", "AUG | Momentum", "XM1014 | Incinegator", "R8 Revolver | Skull Crusher",
            "AWP | Atheris", "Desert Eagle | Light Rail", "MP5-SD | Gauss", "UMP-45 | Moonrise", "Tec-9 | Bamboozle", "AK-47 | Uncharted",
            "MAC-10 | Whitefish", "P250 | Verdigris", "FAMAS | Crypsis", "Galil AR | Akoben", "P90 | Off World", "MP7 | Mischief"];
let finalJSON = []
let outputFile = './outputJSON'

function getWeaponTag(weapon) {
    switch (weapon) {
        case 'AK-47':
            return "tag_weapon_ak47";
        case 'AUG':
            return "tag_weapon_aug";
        case 'Bayonet':
            return "tag_weapon_awp";
        case 'Bowie Knife':
            return "tag_weapon_knife_survival_bowie";
        case 'Butterfly Knife':
            return "tag_weapon_knife_butterfly";
        case 'CZ75-Auto':
            return "tag_weapon_cz75a";tag_weapon_ak47
        case 'Desert Eagle':
            return "tag_weapon_deagle";
        case 'Dual Berettas':
            return "tag_weapon_elite";
        case 'Falchion Knife':
            return "tag_weapon_knife_falchion";
        case 'FAMAS':
            return "tag_weapon_famas";
        case 'Five-SeveN':
            return "tag_weapon_fiveseven";
        case 'Flip Knife':
            return "tag_weapon_knife_flip";
        case 'G3SG1':
            return "tag_weapon_g3sg1";
        case 'Galil AR':
            return "tag_weapon_galilar";
        case 'Glock-18':
            return "tag_weapon_glock";
        case 'Gut Knife':
            return "tag_weapon_knife_gut";
        case 'Huntsman Knife':
            return "tag_weapon_knife_tactical";
        case 'Karambit':
            return "tag_weapon_knife_karambit";
        case 'M249':
            return "tag_weapon_m249";
        case 'M4A1-S':
            return "tag_weapon_m4a1_silencer";
        case 'M4A4':
            return "tag_weapon_m4a1";
        case 'M9 Bayonet':
            return "tag_weapon_knife_m9_bayonet";    
        case 'MAC-10':
            return "tag_weapon_mac10";    
        case 'MAG-7':
            return "tag_weapon_mag7";    
        case 'MP5-SD':
            return "tag_weapon_mp5sd";    
        case 'MP7':
            return "tag_weapon_mp7";    
        case 'MP9':
            return "tag_weapon_mp9";    
        case 'Navaja Knife':
            return "tag_weapon_knife_gypsy_jackknife";    
        case 'Negev':
            return "tag_weapon_negev";    
        case 'Nova':
            return "tag_weapon_nova";    
        case 'P2000':
            return "tag_weapon_hkp2000";    
        case 'P250':
            return "tag_weapon_p250";    
        case 'P90':
            return "tag_weapon_p90";    
        case 'PP-Bizon':
            return "tag_weapon_bizon";    
        case 'R8 Revolver':
            return "tag_weapon_revolver";    
        case 'Sawed-Off':
            return "tag_weapon_sawedoff";    
        case 'SCAR-20':
            return "tag_weapon_scar20";    
        case 'SG 553':
            return "tag_weapon_sg556";    
        case 'Shadow Daggers':
            return "tag_weapon_knife_push";    
        case 'SSG 08':
            return "tag_weapon_ssg08";    
        case 'Stiletto Knife':
            return "tag_weapon_knife_stiletto";    
        case 'Talon Knife':
            return "tag_weapon_knife_widowmaker";    
        case 'Tec-9':
            return "tag_weapon_tec9";    
        case 'UMP-45':
            return "tag_weapon_ump45";    
        case 'Ursus Knife':
            return "tag_weapon_knife_ursus";    
        case 'USP-S':
            return "tag_weapon_usp_silencer";    
        case 'XM1014':
            return "tag_weapon_xm1014";   
    }
}

function JSONFormat() {
    itemList.forEach(function(item) {
        let splitedItem = item.split(" | ")
        let weapon = splitedItem[0]
        let skin = splitedItem[1]
        finalJSON.push({
            [weapon]: {
                [skin]: {
                    "Field-Tested": {
                        "image": "Error",
                        "buyLink": `https://steamcommunity.com/market/listings/730/${weapon.replace(/\s/g, "")}%20%7C%20${encodeURIComponent(skin)}%20%28Field-Tested%29`
                    },
                    "Minimal Wear": {
                        "image": "Error",
                        "buyLink": `https://steamcommunity.com/market/listings/730/${weapon.replace(/\s/g, "")}%20%7C%20${encodeURIComponent(skin)}%20%28Minimal%20Wear%29`
                    },
                    "Battle-Scarred": {
                        "image": "Error",
                        "buyLink": `https://steamcommunity.com/market/listings/730/${weapon.replace(/\s/g, "")}%20%7C%20${encodeURIComponent(skin)}%20%28Battle-Scarred%29`
                    },
                    "Well-Worn": {
                        "image": "Error",
                        "buyLink": `https://steamcommunity.com/market/listings/730/${weapon.replace(/\s/g, "")}%20%7C%20${encodeURIComponent(skin)}%20%28Well-Worn%29`
                    },
                    "Factory New": {
                        "image": "Error",
                        "buyLink": `https://steamcommunity.com/market/listings/730/${weapon.replace(/\s/g, "")}%20%7C%20${encodeURIComponent(skin)}%20%28Factory%20New%29`
                    },
                    "Compare": {
                        "buyLink": `https://steamcommunity.com/market/search?q=${encodeURIComponent(skin)}&category_730_Weapon%5B%5D=${getWeaponTag(weapon)}&appid=730`
                    }
                }
            }
        })
    }); 
    fs.writeFile(outputFile, JSON.stringify(finalJSON, null, 4), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`JSON saved in ${outputFile}`);
    });    
}

JSONFormat()