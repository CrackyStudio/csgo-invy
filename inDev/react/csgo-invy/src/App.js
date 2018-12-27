import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { Pane, Tablist, SidebarTab, Button } from "evergreen-ui";
import logo from './logo.gif'
import skinsList from './skinsList.json'
import Component from "@reactions/component";

let missingWeaponSkinsArray = missingWeaponSkinsArray || [];
let weaponList = ["AK-47", "AUG", "AWP", "Bayonet", "Bowie Knife", "Butterfly Knife", "CZ75-Auto", "Desert Eagle", "Dual Berettas", 
"Falchion Knife", "FAMAS", "Five-SeveN", "Flip Knife", "G3SG1", "Galil AR", "Glock-18", "Gut Knife", "Huntsman Knife", "Karambit", 
"M249", "M4A1-S", "M4A4", "M9 Bayonet", "MAC-10", "MAG-7", "MP7", "MP9", "Negev", "Nova", "P2000", "P250", "P90", "PP-Bizon", 
"R8 Revolver", "Sawed-Off", "SCAR-20", "SG 553", "Shadow Daggers", "SSG 08", "Tec-9", "UMP-45", "USP-S", "XM1014"];

class App extends Component {
  getJSON = async (response) => {
    response = await fetch(`https://cors-anywhere.herokuapp.com/https://steamcommunity.com/id/crackystudio/inventory/json/730/2`, {
    headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
    .catch(function(error) {
      console.log(error.message);
    });
    const json = await response.json();
    this.getInventory(json)
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
  }

  getMissingWeaponSkins(missingSkinsArray, weapon) {
    for(let i = 0; i < missingSkinsArray.length; i++) {
      if(missingSkinsArray[i].indexOf(weapon) >= 0) {    
        missingWeaponSkinsArray.push(missingSkinsArray[i])      
      }
    }
  }

  buildList(weapon) {  
    let weaponList = []
    missingWeaponSkinsArray.map(function(e) {   
      if (e.indexOf(weapon) > -1) {
        weaponList.push(e.replace(new RegExp(`${weapon} \\| `, "g"), ""))
      }   
    })
    console.log(weaponList) 
    return weaponList.map(function(weapon) {
      return <li>{weapon}</li>
    })     
  }

  render() {
    return (
      <Router>
        <>
          <Pane display="flex" background="#171A21" borderRadius={3} height={"10vh"} alignItems="center" onClick={this.getJSON}>
            <Pane paddingLeft={12} flex={1} alignItems="center" display="flex">
              <img src={logo} alt="Logo" width={100}/>
            </Pane>
            <Button background="#5F7B1F" color="white" marginRight={16}>Get Inventory</Button>
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
                <Pane padding={16} background="#1B2936" color="white" flex="1">
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
                      index === state.selectedIndex && tab === "AK-47" && ( 
                        <>
                          {this.buildList("AK-47")}
                        </>
                      )
                    }    
                    {
                      index === state.selectedIndex && tab === "AUG" && ( 
                        <>
                          {this.buildList("AUG")}
                        </>
                      )
                    }    
                    {
                      index === state.selectedIndex && tab === "AWP" && (  
                        <>
                          {this.buildList("AWP")}
                        </>
                      )
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
