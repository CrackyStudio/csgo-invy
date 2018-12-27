const mainModel = require("../models/main.js");
const fs = require("fs");

function main(router) {
    router.get("/main", (req, res) => {
        myInventoryArray = [];
        mainModel.mainPage(req, res)
    })
    router.post("/myInventory", function(req, res) {
        let accountURL = req.body.steamAccountUrl
        mainModel.steamAccountInfo(accountURL, res, req);
    });
    router.get("/dashboard", (req, res) => {
        let object = req.session.object;
        getInventory(object, req)
        getMissingSkins(req)
        res.render('dashboard.ejs')
    })
    router.get("/myInventory", (req, res) => {
        res.render('objectView.ejs', {myObject: req.session.inventoryArray, image: req.session.imageArray});
    })
    router.get("/missingSkins", (req, res) => {
        res.render('objectView.ejs', {myObject: req.session.missingSkinsArray});
    })
    router.get("/missingSkins/AK-47", (req, res) => {
        let weapon = req.route.path.substring(14)
        getMissingWeaponSkins(req, res, weapon)     
    })
    router.get("/missingSkins/Glock-18", (req, res) => {
        let weapon = req.route.path.substring(14)
        getMissingWeaponSkins(req, res, weapon)   
    })
}
// ------------------------------------------------
///////////////////////////////////////////////////
// FUNCTIONS: ------------------------------------- SHOULD BE MOVED TO MODEL
function getInventory(object, req) {
    req.session.ownedItems = req.session.ownedItems || [];
    req.session.ownedItems.push(object);
    req.session.inventoryArray = req.session.inventoryArray || [];
    req.session.imageArray = req.session.imageArray || [];
    for (let i of req.session.ownedItems) {      
        let item = req.session.ownedItems.find((item) => {
            for (let items in item.rgDescriptions) {
                for (let market_hash_name in item.rgDescriptions[items]) {
                    let vanillaName = item.rgDescriptions[items].market_hash_name
                    req.session.inventoryArray.push(vanillaName.replace(/\s(\(Minimal Wear\))|\s(\(Field-Tested\))|\s(\(Battle-Scarred\))|\s(\(Well-Worn\))|\s(\(Factory New\))|StatTrak™\s|★\s/g, ''))
                    req.session.imageArray.push(`https://steamcommunity-a.akamaihd.net/economy/image/${item.rgDescriptions[items].icon_url}`)
                    break;
                }
            }
        })
    }
}
function getMissingSkins(req) {
    req.session.missingSkinsArray = req.session.missingSkinsArray || [];
    let itemsListFile = JSON.parse(fs.readFileSync('./res/skinsList.json', 'utf8'));
    for(let i = 0; i < itemsListFile.length; i++) {
        if(!( req.session.inventoryArray.indexOf(itemsListFile[i]) >= 0)) {
            req.session.missingSkinsArray.push(itemsListFile[i])
        }
    }
}
function getMissingWeaponSkins(req, res, weapon) {
    let pattern = `${weapon} \\| `
    let re = new RegExp(pattern, "g");
    req.session.missingWeaponSkinsArray = req.session.missingWeaponSkinsArray || [];
    req.session.missingWeaponSkinsImageArray = req.session.missingWeaponSkinsImageArray || [];
    for(let i = 0; i < req.session.missingSkinsArray.length; i++) {
        if(req.session.missingSkinsArray[i].indexOf(weapon) >= 0) {
            //console.log(req.session.missingSkinsArray[i])

            // END OF TEST
            req.session.missingWeaponSkinsArray.push(req.session.missingSkinsArray[i].replace(re, ""))      
        }
    }
    res.render('objectView.ejs', {myObject:  req.session.missingWeaponSkinsArray, weaponName: weapon, image: req.session.missingWeaponSkinsImageArray});
}
// ------------------------------------------------
///////////////////////////////////////////////////
module.exports = main;