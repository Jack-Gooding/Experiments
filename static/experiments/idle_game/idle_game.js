//===================//
//Cookie Control Functions
//===================//


// Creates Cookies
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

// Retreives Cookies from Browsers
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Clears specific Cookies
function deleteCookie(cname) {
  document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Checks if Cookie Exists
function cookieExists(cookie, base) {
    if (getCookie(cookie) > base) {
      let cookie = getCookie(cookie);
    } else {
      let cookie = base;
    }

}

// If 'cookieWarning' Cookie exists, set cookieWarning appropriately.
if (getCookie("cookieWarning") != 0) {
  let cookieWarning = 1;
} else {
  let cookieWarning = 0;
}

// Creates HTML & JQuery for cookie warning
let $cookieWarning = $("<div/>")
.addClass("cookieWarning")
.html("<div><p>This page uses cookies to improve your experience. To acknowledge, click this button -> "+"  "+"  </p><button> Ok!</button></div>")

if (getCookie("cookieWarning") == 0 ) {
  $("body").append($cookieWarning);
}

$(".cookieWarning button").click(function() {
  $(".cookieWarning").fadeOut(500)
  setCookie("cookieWarning", 1, 5);
});
//===================//
//Global Variables
//===================//

// Misc
let multiplyVal = 1.15;

// Cookies
if (getCookie("clickCount") > 0) {
  clickCount = getCookie("clickCount");
} else {
  clickCount = 0;
}

// Pre Generator values

let clickValBuild = 1
let clickValUpgrade = 1;

let autoCountUpgrade = 1;
let autoCountBuild = 0;
// Final Generator values
let clickVal = 1;
let autoCount = 0;

// Trackers
let upgradeCount = 0;

let timer = 0;

let clickCountDisplay = 0;
let achievementMultiplier = 100;
let numberClicks = 0;
let numberAchievements = 0;

//===================//
//Building Generator
//===================//

class Buildings {
    constructor(name,reference,buildCost,description,effect) {
      this._buildNumber = 0;
      this._name = name;
      this._reference = reference;
      this._description = description;
      this._effect = effect;
      this._buildCost = buildCost;
    }

    get name() {
      return this._name;
    }

    get buildNumber() {
      return this._buildNumber;
    }

    get reference() {
      return this._reference;
    }

    get description() {
      return this._description;
    }

    get buildCost() {
      return this._buildCost;
    }

    get effect() {
      return this._effect;
    }

    incrementBuildNumber() {
      this._buildNumber++;
    }

    decrementBuildNumber() {
      this._buildNumber--;
    }

    setBuildingCookie() {
      setCookie(this._reference,this._buildNumber, 5);
    }

    getBuildingCookie() {
      if (getCookie(this._reference) != 0) {
        this._buildNumber = getCookie(this._reference);
      } else {
        this._buildNumber = 0;
      }
    }

  };

class CPCBuildings extends Buildings {
  constructor(name,reference,buildCost,description,effect) {
      super(name,reference,buildCost,description,effect);
  }

  doBuildingEffect() {
      clickValBuild += this._effect;
      autoCountBuild += this._effect/10;
  }

};

class CPSBuildings extends Buildings {
  constructor(name,reference,buildCost,description,effect) {
    super(name,reference,buildCost,description,effect);
  }

  doBuildingEffect() {
    autoCountBuild += this._effect;
  }

};


//Adds 'Buildings' instances
let mouse = new CPCBuildings('Mouse upgrade','mouse',15,'+1 click per click',1);
let paperPlane = new CPSBuildings('Paper Plane','paperPlane',100,'1cps per Paper Plane', 1);
let bottleRocket = new CPSBuildings('Bottle Rocket','bottleRocket',2000,'10cps per Bottle Rocket',10);
let generator = new CPSBuildings('Generator','generator',40000,'100cps per Generator',100);
let fighterJet = new CPSBuildings('Fighter Jet', 'fighterJet', 800000, '1000cps per Fighter Jet', 1000);
let spaceRocket = new CPSBuildings('Space Rocket', 'spaceRocket', 16000000,'10000cps per Space Rocket', 10000);
let planetMine = new CPSBuildings('Planet Mine', 'planetMine', 320000000, '100000cps per Planet Mine', 100000);
let solarDrain = new CPSBuildings('Solar Drain', 'solarDrain', 6400000000, '1000000cps per Solar Drain', 1000000)
let galaxyFarm = new CPSBuildings('Galaxy Drain','galaxyDrain',12800000000,'10000000cps per Galaxy Drain',10000000);
let universeImploder = new CPSBuildings('Universe Imploder','universeImploder',256000000000,'100000000cps per Universe Imploder',100000000);
let dimensionRift = new CPSBuildings('Dimension Rift','dimensionRift',5120000000000,'1000000000cps per Dimension Rift',1000000000);

//List of all 'Buildings'
let buildingList = [
  mouse,
  paperPlane,
  bottleRocket,
  generator,
  fighterJet,
  spaceRocket,
  planetMine,
  solarDrain,
  galaxyFarm,
  universeImploder,
  dimensionRift
];

// Controls the x1, x10, x100 buttons

let purchaseAmount = 1;

$(".x1").click(function() {
  purchaseAmount = 1;
  $(".x100, .x25, .x10, x1").removeClass("purchaseAmountActive");
  $(this).addClass("purchaseAmountActive");
});

$(".x10").click(function() {
  purchaseAmount = 10;
  $(".x100, .x25, .x10, .x1").removeClass("purchaseAmountActive");
  $(this).addClass("purchaseAmountActive");
});

$(".x25").click(function() {
  purchaseAmount = 25;
  $(".x100, .x25, .x10, .x1").removeClass("purchaseAmountActive");
  $(this).addClass("purchaseAmountActive");
});

$(".x100").click(function() {
  purchaseAmount = 100;
  $(".x100, .x25, .x10, .x1").removeClass("purchaseAmountActive");
  $(this).addClass("purchaseAmountActive");
});

// Cycle through 'buildingList', generate buildings based on 'Buildings'
for (let i = 0 ; i < buildingList.length; i++) {

  let $newBuildingBox = $("<div/>")   // creates a div element
      // add a class
    .addClass(`buildingBox ${buildingList[i].reference}`)
      //add html
    .html(
      "<div id="+buildingList[i].reference+" class='buildCount'>"+
        "<p class='buildingBoxText'>"+buildingList[i].buildNumber+"</p>"+
      "</div>"+
      "<div class='buildingContainer'>"+
        "<div class='buildingName'><p class='buildingBoxText'>"+buildingList[i].name+"</p></div>"+
        "<div class='buildCost "+buildingList[i].buildCost+"'><p class='buildingBoxText'>"+buildingList[i].buildCost+"</p></div>"+
      "</div>"+
    "<div class='description' style='display:none;'>"+buildingList[i].description+"</div>");
      // add this element into the '.buildings' div
    $(".buildings").append($newBuildingBox);



    // add onClick effects to this new element
  $("."+buildingList[i].reference).click(function() {
    for (let j = 0; j < purchaseAmount; j++) {
      buildingList[i].setBuildingCookie();
      if (clickCount >= Math.round(buildingList[i].buildCost * (multiplyVal ** buildingList[i].buildNumber ))) {
          clickCount -= Math.round(buildingList[i].buildCost * (multiplyVal ** buildingList[i].buildNumber ));
          buildingList[i].incrementBuildNumber();
          $(this).find(".buildCount").html("<p class='buildingBoxText'>"+buildingList[i].buildNumber+"</p>");
          $(this).find(".buildCost").html("<p class='buildingBoxText'>"+Math.round(buildingList[i].buildCost * (multiplyVal ** buildingList[i].buildNumber ))+"</p>");
          buildingList[i].doBuildingEffect();
        };
      }
    });

};

$(document).ready(function() {
  for (let i = 0 ; i < buildingList.length; i++) {
  buildingList[i].getBuildingCookie();
  $("."+buildingList[i].reference).find(".buildCount").html("<p class='buildingBoxText'>"+buildingList[i].buildNumber+"</p>");
  $("."+buildingList[i].reference).find(".buildCost").html("<p class='buildingBoxText'>"+Math.round(buildingList[i].buildCost * (multiplyVal ** buildingList[i].buildNumber ))+"</p>");
  for (let j = 0; j < buildingList[i].buildNumber; j++) {
    buildingList[i].doBuildingEffect();
  }
}
});



//===================//
//upgrade Generator
//===================//

class Upgrades {
  constructor(name,reference,buyCost,description,criteria,type,effect) {
    this._name = name;
    this._reference = reference;
    this._buyCost = buyCost;
    this._description = description;
    this._criteria = criteria;
    this._type = type;
    this._effect = effect;
    this._purchased = 0;
  }

  setPurchased() {
    this._purchased = 1;
  }
  get name() {
    return this._name;
  }

  get reference() {
    return this._reference;
  }

  get buyCost() {
    return this._buyCost;
  }

  get description() {
    return this._description;
  }

  get criteria() {
    return this._criteria;
  }

  get type() {
    return this._type;
  }

  get effect() {
    return this._effect;
  }

  get purchased() {
    return this._purchased;
  }


  doUpgradeEffect() {
    clickValUpgrade *= this._effect;
  }

  setUpgradeCookie() {
    setCookie(this._reference,this._purchased, 5);
  }

  getUpgradeCookie() {
    if (getCookie(this._reference) == 1) {
      this._purchased = getCookie(this._reference);
      upgradeCount++;
    } else {
      this._purchased = 0;
    }
  }
};

// (name,reference,buyCost,description,criteria,effect)

let chocolateChip = new Upgrades('Chocolate Chip','chocolateChip',10,'Gives 15% CPS boost!',true,'clickValUpgrade',1.15);
let whiteChoc = new Upgrades('White Chocolate','whiteChoc',25,'Gives 20% CPS boost!',true,'autoCountUpgrade',1.15);
let raisin = new Upgrades('Raisin','raisin',50,'Gives 15% CPS boost!',true,'autoCountUpgrade',1.15);
let darkChoc = new Upgrades('Dark Chocolate','darkChoc',50,'Gives 15% CPS boost!',true,'autoCountUpgrade',1.15);
let brownie = new Upgrades('Brownie','brownie',200,'Gives 15% CPS boost!',true,'autoCountUpgrade',1.15);
let blueberryMuffin = new Upgrades('Blueberry Muffin','blueberryMuffin',1000,'Gives 500% CPS boost!',true,'autoCountUpgrade',5);
let raspberryMuffin = new Upgrades('Raspberry Muffin','raspberryMuffin',5000,'Gives 500% CPS boost!',true,'autoCountUpgrade',5);
let bananaMuffin = new Upgrades('Banana Muffin','bananaMuffin',20000,'Gives 500% CPS boost!',true,'autoCountUpgrade',5);
let pumpkinMuffin = new Upgrades('Pumpkin Muffin','pumpkinMuffin',1000000,'Gives 500% CPS boost!',true,'autoCountUpgrade',5);


let upgradeList = [
  chocolateChip,
  whiteChoc,
  raisin,
  darkChoc,
  brownie,
  blueberryMuffin,
  raspberryMuffin,
  bananaMuffin,
  pumpkinMuffin,
];


let buildNumberUpgrades = new Array (
  10,
  25,
  50,
);

for (let k = 0; k < buildNumberUpgrades.length; k++) {

(function(context) {
    for ( let i = 0; i < buildingList.length; i++) {
       let key = `${buildNumberUpgrades[k]}${buildingList[i].reference}`;
       let upgradeCost = Math.floor(buildNumberUpgrades[k]*buildingList[i].buildCost * multiplyVal* 0.5);
       key = new Upgrades(`${buildNumberUpgrades[k]} ${buildingList[i].name}!`,`${buildNumberUpgrades[k]}${buildingList[i].reference}`,upgradeCost,`You bought ${buildNumberUpgrades[k]} ${buildingList[i].name}!`,false,'clickValUpgrade',5);
       upgradeList.push(key);
       $(".upgrades").append(this[key]);
     }
}(window));

};


for (let i = 0 ; i < upgradeList.length; i++) {

  // This Section creates Elements for each item in UpgradeList
  let $newUpgradeBox = $("<div style='display:none'/>")   // creates a div element
  .addClass(`upgradeBox ${upgradeList[i].reference}`)   // add a class
  .html(
    "<div class='upgradePadding'>"+
    "<div class='upgradeName'>"+upgradeList[i].name+"</div>"+
    "<div class='upgradeCost'>"+upgradeList[i].buyCost+"</div>"+
  "</div>"+
  "<div class='description' style='display:none;'>"+upgradeList[i].description+"</div>");

  $(".upgrades").append($newUpgradeBox);
  //



  let tempCost = upgradeList[i].buyCost;
  let tempEffect = upgradeList[i].effect;
  let tempName = upgradeList[i].reference;

  if (getCookie(upgradeList[i]._reference) != 0) {
    upgradeList[i]._purchased = getCookie(upgradeList[i]._reference);
    upgradeCount++;
    $(".upgradeCount").text(`Number of Upgrades: ${upgradeCount}`);
    clickValUpgrade *= tempEffect;
    autoCountUpgrade *= tempEffect;
  } else {
    upgradeList[i]._purchased = 0;
  }

//
// Controls Validation when clicking upgrades
//
  $(`.${upgradeList[i].reference}`).mousedown(function() {
    if (clickCount >= tempCost) {
      upgradeList[i].purchased = 1;
      upgradeList[i]._purchased = 1;
      clickValUpgrade *= tempEffect;
      autoCountUpgrade *= tempEffect;
      upgradeCount++;
      clickCount -= tempCost;
      setCookie(tempName,1,5);
      $(this).hide(0);
      $(".upgradeCount").text(`Number of Upgrades: ${upgradeCount}`);
  }
});

};




// Show Upgrades when 20% of cost, make blue when 100%;
setInterval(function(){
  for (var i = 0 ; i < upgradeList.length; i++) {
    if (clickCount >= upgradeList[i].buyCost * 0.2 && upgradeList[i].purchased == 0 && upgradeList[i].criteria) {
      $("."+upgradeList[i].reference).fadeIn(1000);
    }

  if (clickCount >= upgradeList[i].buyCost) {
    $("."+upgradeList[i].reference).find(".upgradePadding").css("background","blue");
  }
  else if (clickCount < upgradeList[i].buyCost) {
      $("."+upgradeList[i].reference).find(".upgradePadding").css("background","green");
}}

  for (let j = 0; j < buildingList.length; j++) {
    if (clickCount >= Math.round(buildingList[j].buildCost * (multiplyVal ** buildingList[j].buildNumber ))) {
      $("."+buildingList[j].buildCost).css("background","green");
    } else {
      $("."+buildingList[j].buildCost).css("background","red");
    }


  /*  // This Adds Upgrades for each building with x built
    for (let k = 0; k < buildNumberUpgrades.length; k++) {
      if (buildingList[j].buildNumber > buildNumberUpgrades[k] ) {
        $(".upgrades").append(buildingList[j].reference+" "+buildNumberUpgrades[k]);
      }
    }*/
  }


}, 1000)

/*$(".upgradeBox, .building").hover(function() {
  $(this).find(".description").show();
}, function() {
  $(this).find(".description").hide();
})*/

$(".buyAll").click(function() {
  for (let i = 0; i < upgradeList.length; i++) {
    let tempCost = upgradeList[i].buyCost;
    let tempEffect = upgradeList[i].effect;
    let tempName = upgradeList[i].reference;
    if (clickCount >= tempCost && upgradeList[i].purchased != 1) {
      $(`.${upgradeList[i].reference}`).hide(0);
      upgradeList[i].purchased = 1;
      upgradeList[i]._purchased = 1;
      clickValUpgrade *= tempEffect;
      autoCountUpgrade *= tempEffect;
      upgradeCount++;
      clickCount -= tempCost;
      $(".upgradeCount").text(`Number of Upgrades: ${upgradeCount}`);
      setCookie(tempName,2, 5);
    }
  }
})

class Achievements {
  constructor(name,reference,description,criteria,type,reward) {
    this._unlocked = 0;
    this._name = name;
    this._reference = reference;
    this._description = description;
    this._criteria = criteria;
    this._type = type;
    this._reward = reward;
  }

  get unlocked() {
    return this._unlocked;
  }

  get name() {
    return this._name;
  }

  get reference() {
    return this._reference;
  }

  get description() {
    return this._description;
  }

  get criteria() {
    return this._criteria;
  }

  get type() {
    return this._type;
  }

  get reward() {
    return this._reward;
  }

  lock() {
    this._unlocked = 1;
  }


  setAchievementCookie() {
    setCookie(this._reference, this._unlocked, 5);
  }

  getAchievementCookie() {
    if (getCookie(this._reference) == 1) {
      this._unlocked = getCookie(this._reference);
      achievementMultiplier += this._reward;
      numberAchievements++;
    } else {
      this._unlocked = 0;
    }
  }


};

//                            (name,reference,description,criteria,type,reward)
const oneOne = new Achievements('One One!','oneOne','You earned 1 Click!',1,"clickCount",1);
const oneTen = new Achievements('Ten!','oneTen','You earned 10 Clicks!',10,"clickCount",1);
const oneHundred = new Achievements('One Hundred!','oneHundred','You earned 100 Clicks!',100,"clickCount",2);
const oneThousand = new Achievements('One Thousand!','oneThousand','You earned 1000 Clicks!',1000,"clickCount",2);

const upgradeOne = new Achievements('One upgrade!','upgradeOne','You bought 1 upgrade!',1,"upgradeCount",1);
const upgradeThree = new Achievements('Three upgrades!','upgradeThree','You bought 3 Upgrades!',3,"upgradeCount",2);
const upgradeSix = new Achievements('Six upgrades!','upgradeSix','You bought 6 Upgrades!',6,"upgradeCount",3);

let achievementList = new Array(
  oneOne,
  oneTen,
  oneHundred,
  oneThousand,
  upgradeOne,
  upgradeThree,
  upgradeSix,

);


let buildAchievementUnlocks = new Array(
  1,
  10,
  25,
  50,
  75,
  100,
  150,
  200
);

for (let k = 0; k < buildAchievementUnlocks.length; k++) {

(function(context) {
    for ( let i = 0; i < buildingList.length; i++) {
       let key = `${buildingList[i].reference}${buildAchievementUnlocks[k]}`;
       key = new Achievements(`${buildAchievementUnlocks[k]} ${buildingList[i].name}!`,`${buildingList[i].reference}${buildAchievementUnlocks[k]}`,`You bought ${buildAchievementUnlocks[k]} ${buildingList[i].name}!`,buildAchievementUnlocks[k],"buildNumber",(k+1));
       achievementList.push(key);
       $(".display").append(this[key]);
     }
}(window));

};


setInterval(function(){
  for (let i = 0; i < achievementList.length; i++) {

    let filler = $("<div/>").addClass(achievementList[i].reference).html("<div style='width: 60px; height: 60px; background: rgba(255,255,255,1); margin: 5px; color: black; border: solid 2px grey; text-align: center;'>"+achievementList[i].name+"</div>");

  if (clickCount >= achievementList[i].criteria && achievementList[i].unlocked == 0 && achievementList[i].type == "clickCount") {
    let $newAchievementBox = $("<div/>").addClass("achievement").html("<div style='background: grey; width: 100%;'>"+achievementList[i].name+"</div><div style='width: 100%;'>"+achievementList[i].description+"</div>");
    $("body").append($newAchievementBox);
    $newAchievementBox.delay(1000).fadeOut(2000);
    achievementList[i].lock();
    numberAchievements++;
    achievementMultiplier += achievementList[i].reward;
    achievementList[i].setAchievementCookie();
    $(".acheivementsContainer").append(filler);

  }

  if (upgradeCount >= achievementList[i].criteria && achievementList[i].unlocked == 0 && achievementList[i].type == "upgradeCount") {
    let $newAchievementBox = $("<div/>").addClass("achievement").html("<div style='background: grey; width: 100%;'>"+achievementList[i].name+"</div><div style='width: 100%;'>"+achievementList[i].description+"</div>");
    $("body").append($newAchievementBox);
    $(".acheivementsContainer").append(filler);
    $newAchievementBox.delay(1000).fadeOut(2000);
    achievementList[i].lock();
    numberAchievements++;
    achievementMultiplier += achievementList[i].reward;
    achievementList[i].setAchievementCookie();

  }

for ( var j = 0; j < buildingList.length; j++) {
if (`${buildingList[j].reference}${achievementList[i].criteria}` === achievementList[i].reference && buildingList[j].buildNumber >= achievementList[i].criteria && achievementList[i].unlocked == 0 && achievementList[i].type == "buildNumber") {
    let $newAchievementBox = $("<div/>").addClass("achievement").html("<div style='background: grey; width: 100%;'>"+achievementList[i].name+"</div><div style='width: 100%;'>"+achievementList[i].description+"</div>");
    $("body").append($newAchievementBox);
    $newAchievementBox.delay(1000).fadeOut(2000);
    achievementList[i].lock();
    numberAchievements++;
    achievementMultiplier += achievementList[i].reward;
    achievementList[i].setAchievementCookie();
    $(".acheivementsContainer").append(filler);
    }
  }
}

}, 3000);



for (let i = 0; i < achievementList.length; i++) {
  achievementList[i].getAchievementCookie();
  let filler = $("<div/>").addClass(achievementList[i].reference).html("<div style='width: 60px; height: 60px; background: rgba(255,255,255,1); margin: 5px; color: black; display: flex; border: solid 2px grey;'>"+achievementList[i].name+"</div>");
  if (achievementList[i].unlocked == 1) {
    $(".acheivementsContainer").append(filler);
  }
}

//===================//
//Misc Functions
//===================//

//code goes here that will be run every .1 seconds.

setInterval(function(){
  clickCount = Math.round((clickCount + autoCount/10)*100)/100;
  clickCountDisplay = Math.floor(clickCount*10)/10;
  $(".display h1").text(clickCountDisplay);
  $(".CPS").text(`Clicks per Second: ${autoCount}`);
  $(".CPC").text(`Clicks per Click: ${clickVal}`);
  $(".numberAchievements").text(`Number of Achievements: ${numberAchievements}`);
  $(".achievementMultiplier").text(`Achievement Multiplier: ${achievementMultiplier}%`);
  $(".numberClicks").text(`Number of Clicks: ${numberClicks}`);
  timer += 0.1;
  timer = Math.round(timer*10)/10;
  $(".timer").text(`Time: ${timer}`);

  clickVal = Math.round((clickValBuild * clickValUpgrade * achievementMultiplier/100)*100)/100;
  autoCount = Math.round((autoCountBuild * autoCountUpgrade * achievementMultiplier/100)*100)/100;
  $(".pbar1").css("width",clickCount%100+"%");
}, 100);

// Control over what happens when clicking the cookie
$('.display').mousedown(function() {
  mouseClick(".display");
  /*if (Math.random() > .5) {
    displayPlusNegX = 1;
  } else {
    displayPlusNegX = 2;
  };
  if (Math.random() > .5) {
    displayPlusNegY = 1;
  } else {
    displayPlusNegY = 2;
  };

  displayDistanceX = displayPlusNegX*Math.random()*140;
  displayDistanceY = displayPlusNegY*Math.random()*140;


  let $displayEffect = $("<div/>").addClass("displayEffect").html("<div style='width: 50px; height: 50px; z-index: 25; position: absolute; left: "+displayDistanceX+"px; top: "+displayDistanceY+"px;'><img style='height: 50px;' src='hitmarker1.png'</div>");
  $(".display").append($displayEffect);
  $displayEffect.fadeOut(2000);*/
  clickCount = Math.round((clickCount + clickVal)*100)/100;
  clickCountDisplay = Math.floor(clickCount*10)/10;
  $(".display h1").text(clickCountDisplay);
  numberClicks++;

});


let mouseOver = function(building) {
  $(building).mouseenter(function() {
    $(this).css("border","solid 3px lightblue");
  });
  $(building).mouseleave(function() {
    $(this).css("border","solid 1px black");
  });
};


let mouseClick = function(building) {
  $(building).mousedown(function() {
    $(this).css("transform","translateY(5%)");
    $(this).css("transform","scale(1.03,1.03)");
  });
  $(building).mouseup(function() {
    $(this).css("transform","translateY(5%)");
    $(this).css("transform","scale(1,1)");
  });
};

mouseOver(".display");
mouseOver(".auto");
mouseOver(".mouse");
mouseOver(".grandma");
mouseOver(".upgradePadding");
mouseClick(".upgradeBox");
mouseOver(".buildingBox");
mouseClick(".buildingBox");


//==============//
//Misc Functions//
//==============//



//==============//
//Cookie Control//
//==============//

let saveGame = function(saveText) {
  let $saveMessage =  $("<div/>").addClass("saved").text(saveText);
  setCookie("clickCount", clickCount, 5);
  setCookie("autoCountBuild", clickCount, 5);
  setCookie("clickValBuild", clickValBuild, 5);
  setCookie("upgradeCount", upgradeCount, 5);
  setCookie("timer", timer, 5);
  $(".saved").html($saveMessage);
  $(".saved").show();
  $(".saved").delay(1000).fadeOut(2000);
}

setInterval(function(){
  saveGame("Autosaved!");
}, 10000);

$(".saveButton").click(function() {
  saveGame("Saved!");
})


setInterval(function() {

})

$(".cookieClear").click(function() {
  for (let i = 0; i < buildingList.length; i++) {
    deleteCookie(buildingList[i].reference);
  };
  for (let i = 0; i < achievementList.length; i++) {
    deleteCookie(achievementList[i].reference);
  };
  for (let i = 0; i < upgradeList.length; i++) {
    deleteCookie(upgradeList[i].reference);
  };
  deleteCookie("clickCount");
  deleteCookie("upgradeCount");
  deleteCookie("timer");
  deleteCookie("cookieWarning");
  location.reload();
});
