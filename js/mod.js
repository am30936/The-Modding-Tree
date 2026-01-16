let modInfo = {
	name: "An Operation Tree",
	author: "am30936",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "N/A",
	discordLink: "N/A",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Testing",
}

let changelog = `<h1>Changelog:</h1><br>
	<br>
	<h3>v0.1</h3><br>
		- Added Addition:<br>
			- 12 Upgrades<br>
		- Added Subtraction:<br>
			- 3 Milestones<br>
		- Added 5 Achievements`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)

	// Addition
	if (hasUpgrade('ap', 11)) gain = gain.add(upgradeEffect('ap', 11))
	if (hasUpgrade('ap', 12)) gain = gain.add(upgradeEffect('ap', 12))
	if (hasUpgrade('ap', 13)) gain = gain.add(upgradeEffect('ap', 13))
	if (hasUpgrade('ap', 21)) gain = gain.add(upgradeEffect('ap', 21))
	if (hasUpgrade('ap', 22)) gain = gain.add(upgradeEffect('ap', 22))
	if (hasUpgrade('ap', 23)) gain = gain.add(upgradeEffect('ap', 23))
	if (hasUpgrade('ap', 24)) gain = gain.add(upgradeEffect('ap', 24))
	if (hasUpgrade('ap', 32)) gain = gain.add(upgradeEffect('ap', 32))
	gain = gain.add(tmp.sp.effect.mul(-1))

	if (gain.lte(1)) gain = new Decimal (1)

	// Multiplication
	if (hasAchievement('ach', 21)) gain = gain.mul(1.2)
	//gain = gain.mul(50)

	// Exponentiation


	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"<br>",
	"Current Endgame: 3 Subtraction points",
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}