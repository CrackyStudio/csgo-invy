import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { Pane, Tablist, SidebarTab, Button, TextInput, toaster } from "evergreen-ui";
import logo from './logo.gif'
import skinsList from './skinsList.json'
import Component from "@reactions/component";

let missingWeaponSkinsArray = [];
let weaponList = ["AK-47", "AUG", "AWP", "Bayonet", "Bowie Knife", "Butterfly Knife", "CZ75-Auto", "Desert Eagle", "Dual Berettas", 
"Falchion Knife", "FAMAS", "Five-SeveN", "Flip Knife", "G3SG1", "Galil AR", "Glock-18", "Gut Knife", "Huntsman Knife", "Karambit", 
"M249", "M4A1-S", "M4A4", "M9 Bayonet", "MAC-10", "MAG-7", "MP5-SD", "MP7", "MP9", "Navaja Knife", "Negev", "Nova", "P2000", "P250", "P90", "PP-Bizon", 
"R8 Revolver", "Sawed-Off", "SCAR-20", "SG 553", "Shadow Daggers", "SSG 08", "Stiletto Knife", "Talon Knife", "Tec-9", "UMP-45", "Ursus Knife", "USP-S", "XM1014"];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      currentInput: '',
      selectedWeapon: '',
      selectedSkin: '',
      selectedImage: "",
      selectedBuy: "",
    });
  }

  getJSON = async (response) => {
    if (this.state.currentInput !== '') {
      response = await fetch(`https://cors-anywhere.herokuapp.com/${this.state.currentInput}/inventory/json/730/2`, {
        headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        })
        if (response.ok) {
          toaster.notify('Loading, please wait')
          const json = await response.json();
          if (json.success === false) {
            toaster.danger('Your profile and inventory must be public')
          } else {
            this.getInventory(json)
          }
        } else {
          toaster.danger('Invalid URL')
        }
    } else {
      toaster.danger('Invalid URL')
    }
  };

  getInventory(json) {
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
    let missingSkinsArray = [];
    let itemsListFile = skinsList;
    for(let i = 0; i < itemsListFile.length; i++) {
      if(!(ownedItems.indexOf(itemsListFile[i]) >= 0)) {
        missingSkinsArray.push(itemsListFile[i])
      }
    }
    weaponList.forEach((weapon) => {
      this.getMissingWeaponSkins(missingSkinsArray, weapon)
    }, this);  
    toaster.success('Done! You can navigate through tabs')
  }

  getMissingWeaponSkins(missingSkinsArray, weapon) {
    for(let i = 0; i < missingSkinsArray.length; i++) {
      if(missingSkinsArray[i].indexOf(weapon) >= 0) {    
        missingWeaponSkinsArray.push(missingSkinsArray[i])      
      }
    }
  }
  
  buildList(weapon) {  
    let skinsList = [];
    let index = -1;
    let reg = new RegExp(`^${weapon}`, "g");
    missingWeaponSkinsArray.map((e) => {   
      if (e.search(reg) > -1) {
        let tempToAdd = e.replace(new RegExp(`${weapon} \\| `, "g"), "");
        if (skinsList.includes(tempToAdd) === false) {
          skinsList.push(tempToAdd)
        }
      }
      return skinsList;
    })
    return skinsList.map((skin) => {
      index = index + 1
      return (
        <>
        <li href="#" onClick={() => this.setSelectedWeapon(weapon, skin)}>{skin}</li>
        </>
      )
    })     
  }
  
  async setSelectedWeapon(weapon, skin) {
    const {
      currentInput
    } = this.state;
    let link = "";
    let buy = "";
    let response = await fetch(`https://cors-anywhere.herokuapp.com/https://steamcommunity.com/market/listings/730/${weapon}%20%7C%20${encodeURIComponent(skin)}%20%28Factory%20New%29/render?start=0&count=1&currency=1&format=json`, {
        headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        })
        if (response.ok) {
          const json = await response.json();
          if (json.success === true) {
            if (json.listinginfo.length !== 0) {
              link = `${json.results_html.match(/" src=(.*)" srcset/)[1].substr(1).slice(0, -7)}360fx360f`
              // weapon marketname :
              // Bowie Knife = knife_survival_bowie
              // Butterfly Knife = knife_butterfly
              // CZ75-Auto = cz75a
              // Desert Eagle = deagle
              // Dual Berettas = elite
              // Falchion Knife = knife_falchion
              // Flip Knife = knife_flip
              // Glock-18 = glock
              // Gut Knife = knife_gut
              // Huntsman Knife = knife_tactical
              // Karambit = knife_karambit
              // M4A1-S = m4a1_silencer
              // M4A4 = m4a1
              // M9 Bayonet = knife_m9_bayonet
              // Navaja Knife = knife_gypsy_jackknife
              // P2000 = hkp2000
              // PP-Bizon = bizon
              // R8 Revolver = revolver
              // SG 553 = sg556
              // Shadow Daggers = knife_push
              // Stiletto Knife = knife_stiletto
              // Talon Knife = knife_widowmaker
              // Ursus Knife = knife_ursus
              // USP-S = usp_silencer
              buy = `https://steamcommunity.com/market/search?q=${skin}&category_730_Weapon%5B%5D=tag_weapon_${weapon.toLowerCase().replace(/-|\s/g,"")}&appid=730`;  
            } else {
              // Skin is not available in Factory New (no one sell it)
              link = "#"
              buy = "#"
            }
          }
        }
    await this.setState({currentInput, selectedWeapon: weapon, selectedSkin: skin, selectedImage: link, selectedBuy: buy})
  }

  buildWeaponPanel() {
    if (this.state.selectedWeapon === "") {
      return(
        <div id="right"></div>
      )
    } else {
      return(
        <div id="right" border="1px solid white">
        <>
          <br/>
          {this.state.selectedWeapon} | {this.state.selectedSkin}
          <br/><br/>
          <img border="1px solid white" src={this.state.selectedImage} alt={`${this.state.selectedWeapon} | ${this.state.selectedSkin}`}></img>
          <br/>
          <Button id="weaponButton">      
            <a id="buy" href={this.state.selectedBuy} target="_blank" rel="noopener noreferrer">
              Buy
            </a>
          </Button>
        </>
        </div>
      )
    }
  }

  render() {
    return (
      <Router>
        <>
          <Pane display="flex" background="#171A21" borderRadius={3} height={"10vh"} alignItems="center">
            <Pane paddingLeft={12} flex={1} alignItems="center" display="flex">
            <a href="https://www.crackystudio.com/" target="_blank" rel="noopener noreferrer">
              <img src={logo} alt="Logo" width={100}/>
            </a>
            </Pane>
            <Component initialState={{ value: ''}}>
              <TextInput
                id="mainInput"
                marginRight={16}
                width={350}
                placeholder="Insert Steam URL here"
                onChange={e => this.setState({ currentInput: e.target.value })}
                value={this.state.currentInput}
              />
            }
            </Component>
            <Button id="mainBut" background="#5F7B1F" color="white" marginRight={16} onClick={this.getJSON}>Get Inventory</Button>
          </Pane>

          <Component 
            initialState={{
              selectedIndex: 0,
              tabs: weaponList
            }}
          >
            {({ state, setState }) => (
              <Pane display="flex" height={"90vh"}>
                <Tablist id="wScrollBar" flexBasis={140} float="right" overflow="auto">
                  {state.tabs.map((tab, index) => (
                    <SidebarTab
                      key={tab}
                      id={tab}
                      onSelect={() => setState({ selectedIndex: index })}
                      isSelected={index === state.selectedIndex}
                      aria-controls={`panel-${tab}`}
                    >
                      {tab}
                    </SidebarTab>
                  ))}
                </Tablist>
                <Pane id="wScrollBar" overflowY="auto" minHeight={450} padding={16} paddingBottom={30} background="#1B2936" color="white" flex="1">
                  {state.tabs.map((tab, index) => (
                    <Pane
                      key={tab}
                      id={`panel-${tab}`}
                      role="tabpanel"
                      aria-labelledby={tab}
                      aria-hidden={index !== state.selectedIndex}
                      display={index === state.selectedIndex ? 'block' : 'none'}
                    >
                    <div id="parent">
                      <div id="left">
                      { 
                        weaponList.map((weapon) => (
                          index === state.selectedIndex && tab === weapon && ( 
                            <>
                              {weapon} you still don't own:
                              <br/><br/>
                              {this.buildList(weapon)}
                              <br/>
                            </>
                          )
                        ))
                      }
                      </div>
                      {this.buildWeaponPanel()}
                    </div>
                    </Pane>
                  ))}
                </Pane>
              </Pane>
            )}
          </Component>
        </>
      </Router>
    );
  }
}

export default App;