import React from "react";
import Component from "@reactions/component";
import "../css/About.css";

export default class About extends Component {
    render() {
        return (
            <>
            <div className="content">
                <h1>
                    Welcome to CSGO Invy!
                </h1>
                <p>
                    I'm a totally free web application. Released since November 7, 2018, I'm now available online and I no longer need 
                    to be installed.
                    <br/><br/>
                    Powered by Steam, I also use NodeJS and ReactJS to work. I use few packages like Evergreen (Segment) and forever, 
                    a simple CLI tool for ensuring that my script runs continuously. To grab your inventory data, I use cors-anywhere
                    sending request to Steam.
                </p>
                <br/>
                <strong>
                    My features?
                </strong>
                <p>
                    I analyse your inventory and I list each skins you don't own. You will be able to see this list classified by weapon 
                    and also skins data like pictures and buy links for each skin quality.
                </p>
                <br/>
                <strong>
                    How to use?
                </strong>
                <p>
                    First check that your Steam Inventory is public. If it's private, I will not work. Then copy to clipboard your Steam 
                    Profile URL and finally paste it in my input field at the top of this page. Wait few seconds (sometimes more), and enjoy.
                    And yeah I'm still in development, I'm not perfect.
                </p>
                <br/>
                <strong>
                    Why helping my developer?
                </strong>
                <p>
                    I'm free. But for my developer it's not. He has to pay the server powering me ($2,99/month) and also the domain name 
                    associated with ($9,99/year). I'm also powerful and complete, and it took many hours to Cracky (the dev) to build me.
                    <br/><br/>
                    You can donate <a className="p-a" href="https://www.paypal.me/officialcracky/" target="_blank" rel="noopener noreferrer">here</a>.
                    Or say thanks <a className="p-a" href="https://steamcommunity.com/id/crackystudio/" target="_blank" rel="noopener noreferrer">here</a> :)
                </p>
            </div>
            </>
        )
    }
}