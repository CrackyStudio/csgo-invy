import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { Pane, Tablist, SidebarTab, Button, TextInput, toaster, Spinner } from "evergreen-ui";
import logo from './logo.gif'
import skinsList from './skinsList.json'
import Component from "@reactions/component";

let missingWeaponSkinsArray = [];
let weaponList = ["AK-47", "AUG", "AWP", "Bayonet", "Bowie Knife", "Butterfly Knife", "CZ75-Auto", "Desert Eagle", "Dual Barettas", 
"Falchion Knife", "FAMAS", "Five-SeveN", "Flip Knife", "G3SG1", "Galil AR", "Glock-18", "Gut Knife", "Huntsman Knife", "Karambit", 
"M249", "M4A1-S", "M4A4", "M9 Bayonet", "MAC-10", "MAG-7", "MP5-SD", "MP7", "MP9", "Negev", "Nova", "P2000", "P250", "P90", "PP-Bizon", 
"R8 Revolver", "Sawed-Off", "SCAR-20", "SG 553", "Shadow Daggers", "SSG 08", "Tec-9", "UMP-45", "USP-S", "XM1014"];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      currentInput: ''
    });
  }

  getJSON = async (response) => {
    if (this.state.currentInput != '') {
      response = await fetch(`https://cors-anywhere.herokuapp.com/${this.state.currentInput}/inventory/json/730/2`, {
        headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        })
        if (response.ok) {
          toaster.notify('Loading, please wait')
          const json = await response.json();
          if (json.success == false) {
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
    for (let i of myJSON) {      
      myJSON.find((item) => {
        for (let items in item.rgDescriptions) {
          for (let market_hash_name in item.rgDescriptions[items]) {
            let vanillaName = item.rgDescriptions[items].market_hash_name
            ownedItems.push(vanillaName.replace(/\s(\(Minimal Wear\))|\s(\(Field-Tested\))|\s(\(Battle-Scarred\))|\s(\(Well-Worn\))|\s(\(Factory New\))|StatTrak™\s|★\s/g, ''))
            break;
          }
        }
      })
    }
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
    weaponList.forEach(function(weapon) {
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
    let skinsList = []
    let reg = new RegExp(`^${weapon}`, "g");
    missingWeaponSkinsArray.map(function(e) {   
      if (e.search(reg) > -1) {
        let tempToAdd = e.replace(new RegExp(`${weapon} \\| `, "g"), "");
        if (skinsList.includes(tempToAdd) == false) {
          skinsList.push(tempToAdd)
        }
      }   
    })
    return skinsList.map(function(weapon) {
      return <li>{weapon}</li>
    })     
  }

  render() {
    return (
      <Router>
        <>
          <Pane display="flex" background="#171A21" borderRadius={3} height={"10vh"} alignItems="center">
            <Pane paddingLeft={12} flex={1} alignItems="center" display="flex">
              <img src={logo} alt="Logo" width={100}/>
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
                <Pane id="wScrollBar" overflowY="auto" minHeight={450} padding={16} background="#1B2936" color="white" flex="1">
                  {state.tabs.map((tab, index) => (
                    <Pane
                      key={tab}
                      id={`panel-${tab}`}
                      role="tabpanel"
                      aria-labelledby={tab}
                      aria-hidden={index !== state.selectedIndex}
                      display={index === state.selectedIndex ? 'block' : 'none'}
                    >
                    { 
                      weaponList.map((weapon) => (
                        index === state.selectedIndex && tab === weapon && ( 
                          <>
                            {weapon} you still don't own:
                            <br/><br/>
                            {this.buildList(weapon)}
                            <br/><br/>
                          </>
                        )
                      ))
                    }
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
