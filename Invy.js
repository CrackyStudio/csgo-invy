const fs = require('fs');
const http = require('http');
const https = require('https');

if (process.argv.length >= 3 && process.argv.length < 4) {
  if (fs.existsSync("./ownedItems.json")) {
    printMenu();
    Menu(); 
  } else {
    grabJson()
  }
} else {
  console.log('>> CS:GO Invy • Usage: node Invy.js <steam_profile_url>');
  process.exit(-1)
}

function grabJson(cb) {
  const steamProfileURL = `${process.argv[2]}/inventory/json/730/2`
  const steamJsonUnpDest = './steamJsonUnparsed'
  const file = fs.createWriteStream(steamJsonUnpDest);
  let httpMethod;
  if (steamProfileURL.indexOf(('https://')) !== -1) httpMethod = https;
  else httpMethod = http;
  const request = httpMethod.get(steamProfileURL, (response) => {
    if (response.statusCode !== 200) {
      return cb('Response status was ' + response.statusCode);
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
      prettyJson(steamJsonUnpDest)
    });
  });
  request.on('error', (err) => {
    fs.unlink(steamJsonUnpDest);
    cb(err.message);
  });
  file.on('error', (err) => {
    fs.unlink(steamJsonUnpDest);
    cb(err.message);
  });
}

function prettyJson(Json) {
  const prettyJson = 'steamJsonParsed.json';
  let array = []
  array.push(JSON.parse(fs.readFileSync(Json, 'utf-8')));
  fs.writeFileSync(prettyJson, JSON.stringify(array, null, '\t'))
  fs.unlinkSync(Json);
  analyseItems()
}

function analyseItems() {
  const ownedItems = require('./steamJsonParsed');
  for (let i of ownedItems) {
    let inventoryArray = []
    const item = ownedItems.find((item) => {
      for (let items in item.rgDescriptions) {
        for (let market_hash_name in item.rgDescriptions[items]) {
          let vanillaName = item.rgDescriptions[items].market_hash_name
          inventoryArray.push(vanillaName.replace(/\s(\(Minimal Wear\))|\s(\(Field-Tested\))|\s(\(Battle-Scarred\))|\s(\(Well-Worn\))|\s(\(Factory New\))|StatTrak™\s|★\s/g, ''))
          break;
        }
      }
      fs.writeFileSync('./ownedItems.json', JSON.stringify(inventoryArray, null, '\t'))
      fs.unlinkSync('./steamJsonParsed.json');
    })
  }
  missingItems();
}

function missingItems() {
  const ownedItemsJson = JSON.parse(fs.readFileSync('ownedItems.json', 'utf8'));
  const itemsListFile = JSON.parse(fs.readFileSync('skinsList.json', 'utf8'));
  const missingItemsJson = './missingItems.json';
  const missingItemsArray = []
  for(let i = 0; i < itemsListFile.length; i++) {
    if(!(ownedItemsJson.indexOf(itemsListFile[i]) >= 0)) {
      missingItemsArray.push(itemsListFile[i])
    }
  }
  fs.writeFileSync(missingItemsJson, JSON.stringify(missingItemsArray, null, '\t'))
  printMenu();
  Menu();  
}

function printMenu() {
  console.clear();
  console.log(`
Welcome to CS:GO Invy !
Type "1" to check AK47's skins you still need to grab.

 1: AK-47               11: FAMAS               21: M4A1-S          31: P250                41: UMP-45
 2: AUG                 12: Five-SeveN          22: M4A4            32: P90                 42: USP-S
 3: AWP                 13: Flip Knife          23: M9 Bayonet      33: PP-Bizon            43: XM1014
 4: Bayonet             14: G3SG1               24: MAC-10          34: R8-Revolver         
 5: Bowie Knife         15: Galil AR            25: MAG-7           35: Sawed-Off           ri: Reset inventory (and app)
 6: Butterfly Knife     16: Glock-18            26: MP7             36: SCAR-20             ??: Open the help menu
 7: CZ75-Auto           17: Gut Knife           27: MP9             37: SG 553              mi: Open my inventory
 8: Desert Eagle        18: Huntsman Knife      28: Negev           38: Shadow Daggers      sl: Open the full skins list
 9: Dual Barettas       19: Karambit            29: Nova            39: SSG 08              <3: Say something!
10: Falchion Knife      20: M249                30: P2000           40: Tec-9               xx: Exit
  `);
}

function Menu() {
  process.stdin.setEncoding("ascii");
  process.stdin.on("data", function(chunk) {
    chunk = chunk.toString().trim();
    if (chunk == "mi") {
      printMenu()
      console.log("inDev feature");
    } else if (chunk == "sl") {
      printMenu()
      console.log("inDev feature");
    } else if (chunk == "??") {
      printMenu()
    } else if (chunk == "ri") {
      fs.unlinkSync("./ownedItems.json");
      fs.unlinkSync("./missingItems.json");
      console.clear();
      console.log(`
* * * * * * * * * * * * * * * * * *
*                                 *
* Thank you for using CS:GO Invy! *
*                                 *
* * * * * * * * * * * * * * * * * *
                    ~ Cracky Studio
                    `)
      process.exit();
    } else if (chunk == "<3") {
      const url = 'https://steamcommunity.com/id/crackystudio';
      const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
      require('child_process').exec(start + ' ' + url);
      printMenu()
      console.log("Done.")
    } else if (chunk == "xx") {
      console.clear();
      console.log(`
* * * * * * * * * * * * * * * * * *
*                                 *
* Thank you for using CS:GO Invy! *
*                                 *
* * * * * * * * * * * * * * * * * *
                    ~ Cracky Studio
                    `)
      process.exit();
    } else {
      const missingItemsJson = JSON.parse(fs.readFileSync('missingItems.json', 'utf8'));
      const itemRef = [{1: 'AK-47'}, {2: 'AUG'}, {3: 'AWP'}, {4: "Bayonet"}, {5: "Bowie Knife"}, {6: "Butterfly Knife"}, {7: "CZ75-Auto"}, {8: "Desert Eagle"}, 
      {9: "Dual Barettas"}, {10: "Falchion Knife"}, {11: "FAMAS"}, {12: "Five-SeveN"}, {13: "Flip Knife"}, {14: "G3SG1"}, {15: "Galil AR"}, {16: "Glock-18"}, 
      {17: "Gut Knife"}, {18: "Huntsman Knife"}, {19: "Karambit"}, {20: "M249"}, {21: "M4A1-S"}, {22: "M4A4"}, {23: "M9 Bayonet"}, {24: "MAC-10"}, {25: "MAG-7"},
      {26: "MP7"}, {27: "MP9"}, {28: "Negev"}, {29: "Nova"}, {30: "P2000"}, {31: "P250"}, {32: "P90"}, {33: "PP-Bizon"}, {34: "R8-Revolver"}, {35: "Sawed-Off"}, 
      {36: "SCAR-20"}, {37: "SG 553"}, {38: "Shadow Daggers"}, {39: "SSG 08"}, {40: "Tec-9"}, {41: "UMP-45"}, {42: "USP-S"}, {43: "XM1014"}];
        if (chunk == itemRef[chunk] != undefined) {
          let weapon = Object.values(itemRef[chunk - 1]), pattern = `${weapon} \\| `, re = new RegExp(pattern, "g"), itemArray = [];
          console.clear();
          for(let i = 0; i < missingItemsJson.length; i++) {
            if(missingItemsJson[i].indexOf(weapon) >= 0) {
              itemArray.push(missingItemsJson[i].replace(re, ""))
            }
          }
          console.log(`${weapon} still missing in your inventory:

${itemArray.join(' - ')}

Type ?? to come back into menu.
`);
      } else {
      console.clear()
      printMenu();
      console.log(`Sorry, unknown command :(`)
      } 
    }
  });
}