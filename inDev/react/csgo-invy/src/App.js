import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { TextInput, Pane, toaster } from "evergreen-ui";
import Component from "@reactions/component";

import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/Feedback";

import logo from './res/csgo-invy-logo.png'
import "./css/App.css";
import skinsList from './res/skinsList.json'

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
      isOnline: false,
      isActive: 'About',
    });
  }

  setStatus = async (e) => {
    await this.setState({ currentInput: e });
    await this.getJSON();
  };  

  setActive = (page) => {
    this.setState({ isActive: page });
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
    this.setState({ isOnline: true, isActive: 'Dashboard' });
  }
  
  render() {
    const { isOnline, isActive } = this.state;
    return (
      <Router>
        <>
          <Pane id="navbar">
            <img id="logo" src={logo} alt="Logo"/>
            <Component initialState={{ value: ''}}>
                {() => (
                  <TextInput
                    id="urlInput"
                    marginRight={30}
                    onChange={e => this.setStatus(e.target.value)}
                    onClick={e => e.target.value = ""}
                    value={this.state.currentInput}
                    placeholder="Paste Steam URL here"
                  />
                )}
            </Component>
            <p id={isActive == "About" ? "navbar-p-active" : "navbar-p"} onClick={e => this.setActive(e.target.textContent)}>
              About
            </p>
            <p id={isActive == "Dashboard" ? "navbar-p-active" : "navbar-p"} onClick={e => this.setActive(e.target.textContent)}>
              Dashboard
            </p>
            <a id="a-money" href="https://www.paypal.me/officialcracky/" target="_blank" rel="noopener noreferrer">
              Donation
            </a>
            <a href="https://github.com/CrackyStudio/csgo-invy" target="_blank" rel="noopener noreferrer">
              Open Source
            </a>
            <a href="https://steamcommunity.com/id/crackystudio/" target="_blank" rel="noopener noreferrer">
              Feedback
            </a>
          </Pane>
          <Pane id="main">
            {isActive =="Dashboard" && (
              <>
              {isOnline && (
                <Dashboard weaponList={weaponList} missingWeaponSkinsArray={missingWeaponSkinsArray}/>
              )}
              {!isOnline && (
                "Offline"
              )}
              </>
            )}
            {isActive == "About" && (
              <About/>
            )}
            {isActive == "Feedback" && (
              <Feedback/>
            )}
          </Pane>
          <Pane id="credit">            
            <p>
              2018-2019, CSGO Invy with <span id="love"/> by <a href="https://steamcommunity.com/id/crackystudio/" target="_blank" rel="noopener noreferrer">Cracky</a>
            </p>
          </Pane>  
        </>
      </Router>
    );
  }
}

export default App;