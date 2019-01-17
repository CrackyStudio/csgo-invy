import React from "react";
import Component from "@reactions/component";
import { Pane, Tablist, SidebarTab, Button } from "evergreen-ui";

import "../css/Dashboard.css";
import skinsAPI from '../res/skins.json'

export default class Dashboard extends Component {
    createList = (weapon) => {
        return this.props.missingWeaponSkinsArray.map(item => {
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
                  return (
                    <>
                      <div className="weaponBox">
                        {skin}
                        <img src={validImage} alt={`${weapon} | ${skin}`} className="weaponIMG"></img>
                        <Button id="weaponButton">      
                          <a className="buy" href={skinsAPI[weapon][skin]["Compare"]["buyLink"]} target="_blank" rel="noopener noreferrer">
                            Buy
                          </a>
                        </Button>
                      </div> 
                    </>
                  )
                }
                return null
            } else {
              return null
            }
        })
    }

    render() {
        return (
            <Component 
            initialState={{
              selectedIndex: 0,
              tabs: this.props.weaponList
            }}
          >
            {({ state, setState }) => (
              <Pane display="flex" height={"87vh"}>
                <Tablist id="wScrollBar" flexBasis={140} float="right" overflow="auto">
                  {state.tabs.map((tab, index) => (
                    <SidebarTab
                      key={index}
                      id={tab}
                      onSelect={() => setState({ selectedIndex: index })}
                      isSelected={index === state.selectedIndex}
                      aria-controls={`panel-${tab}`}
                    >
                      {tab}
                    </SidebarTab>
                  ))}
                </Tablist>
                <Pane id="wScrollBar" overflowY="auto" overflowX="hidden" minHeight={450} padding={16} paddingBottom={0} background="#1B2936" color="white" flex="1">
                  {state.tabs.map((tab, index) => (
                    <Pane
                      key={index}
                      id={`panel-${tab}`}
                      role="tabpanel"
                      aria-labelledby={tab}
                      aria-hidden={index !== state.selectedIndex}
                      display={index === state.selectedIndex ? 'block' : 'none'}
                    >
                    <div id="parent">
                      <div id="weapons-tab">
                      { 
                        this.props.weaponList.map((weapon, index) => (
                            <Pane key={index} width="90vw">
                                {index === state.selectedIndex && tab === weapon && ( 
                                    <>
                                        Missing {weapon}: &emsp;
                                        <br/><br/>
                                          <div className="weapons-container">
                                            {this.createList(weapon)}
                                          </div>  
                                        <br/>
                                    </>
                                )}
                            </Pane>
                        ))
                      }
                      </div>

                    </div>
                    </Pane>
                  ))}
                </Pane>
              </Pane>
            )}
          </Component>
        )
    }
}