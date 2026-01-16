addLayer("ap", {
    name: "Addition", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Addition points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = new Decimal(0.75)
        if (hasMilestone('sp', 1)) exp = exp.add(0.1)
            return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "a: Reset for Addition points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    // My upgrades

    upgrades: {
        11: {
            title: "Add by 1",
            effect(){
                let eff = new Decimal(1)
                if (hasUpgrade("ap", 31)) eff = eff.add(9)
                if (hasUpgrade("ap", 34)) eff = eff.add(8)
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[11].effect)},
            cost: new Decimal(1),
        },
        12: {
            title: "Add by 2",
            effect(){
                let eff = new Decimal(2)
                if (hasUpgrade("ap", 34)) eff = eff.add(8)
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[12].effect)},
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("ap", 11)},
        },
        13: {
            title: "Add by 3",
            effect(){
                let eff = new Decimal(3)
                if (hasUpgrade("ap", 34)) eff = eff.add(8)
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[13].effect)},
            cost: new Decimal(3),
            unlocked() {return hasUpgrade("ap", 12)},
        },
        14: {
            title: "Inverse operation",
            description: "Unlock Subtraction points",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("ap", 13)},
        },
        21: {
            title: "Add by 5",
            effect(){
                let eff = new Decimal(5)
                if (hasUpgrade("ap", 34)) eff = eff.add(8)
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[21].effect)},
            cost: new Decimal(10),
            unlocked() {return hasMilestone("sp", 0)},
        },
        22: {
            title: "Add by Points",
            description: "Increase point gain based on itself at a reduced rate",
            cost: new Decimal(15),
            effect() {
                let eff = Decimal.pow(player.points.add(1), 0.2).mul(2)
                if (hasUpgrade('ap', 34)) eff = eff.add(8)
                return eff
            },
            effectDisplay(){ return "+" +format(tmp.ap.upgrades[22].effect)},
            unlocked() {return hasUpgrade("ap", 21)},
        },
        23: {
            title: "Add by Addition Points",
            description: "Increase point gain based on Addition Points at a reduced rate",
            cost: new Decimal(25),
            effect() {

                let pow = new Decimal(0.6)
                if (hasUpgrade('ap', 33)) pow = pow.add(0.2)

                let eff = Decimal.pow(player.ap.points.mul(0.25).add(1), pow)
                if (hasUpgrade('ap', 33)) eff = eff.add(4).mul(1.4)
                eff = eff.mul(1.5)

                if (eff.gt(150)){
                    neff = new Decimal(150)
                    eff = eff.add(-150)
                    neff = neff.add(Decimal.pow(eff, 0.6))
                    eff = neff
                }
                if (hasUpgrade('ap', 34)) eff = eff.add(8)
                return eff
            },
            effectDisplay(){ return "+" +format(tmp.ap.upgrades[23].effect)},
            unlocked() {return hasUpgrade("ap", 22)},
        },
        24: {
            title: "Add by 8",
            effect(){
                let eff = new Decimal(8)
                if (hasUpgrade("ap", 34)) eff = eff.add(8)
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[24].effect)},
            cost: new Decimal(35),
            unlocked() {return hasUpgrade("ap", 23)},
        },
        31: {
            title: "Return to the first",
            description: "Upgrade 1's effect is increased by 9",
            cost: new Decimal(80),
            unlocked() {return hasMilestone("sp", 1) && hasUpgrade('ap', 24)},
        },
        32: {
            title: "Add by Subtraction Points",
            description: "Increase point gain based on Subtraction points at an increased rate",
            cost: new Decimal(100),
            effect() {
                let eff = Decimal.pow(player.sp.points, 2).mul(2)
                if (hasUpgrade("ap", 34)) eff = eff.add(8)
                return eff
            },
            effectDisplay(){ return "+" +format(tmp.ap.upgrades[32].effect)},
            unlocked() {return hasUpgrade("ap", 31)},
        },
        33: {
            title: "Addition adds more",
            description: "Improve the seventh Addition upgrade formula",
            cost: new Decimal(120),
            unlocked() {return hasUpgrade('ap', 32)},
        },
        34: {
            title: "Super boost",
            description: "Every 'Add by' upgrade has its effect increased by 8",
            cost: new Decimal(200),
            unlocked() {return hasUpgrade('ap', 33)},
        },
    },

})

addLayer("sp", {
    name: "Subtraction", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#f01e2c",
    requires: new Decimal(7), // Can be a function that takes requirement increases into account
    resource: "Subtraction points", // Name of prestige currency
    baseResource: "Addition points", // Name of resource prestige is based on
    baseAmount() {return player.ap.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    resetsNothing: false,
    branches: ["ap"],
    effect() {

        // Base
        let base = new Decimal (player.sp.points)

        // Power
        let power = new Decimal(3)
        return base.pow(power)
    },
    effectDescription() {
        return "which are reducing point generation by " +format(tmp.sp.effect)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(0.0075)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "s: Reset for Subtraction points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade('ap', 14)},

    // My milestones

    milestones: {
        0: {
            requirementDescription: "1 Subtraction point",
            effectDescription: "Unlock a new row of Addition upgrades",
            done() {return player.sp.points.gte(1)}
        },
        1: {
            requirementDescription: "2 Subtraction points",
            effectDescription: "Unlock a new row of Addition upgrades. Buff the Addition gain formula slightly",
            done() {return player.sp.points.gte(2)},
            unlocked() {return hasMilestone('sp', 0)}
        },
        2: {
            requirementDescription: "3 Subtraction points",
            effectDescription: "Unlock the Multiplacation Layer (NYI)",
            done() {return player.sp.points.gte(3)},
            unlocked() {return hasMilestone('sp', 1)}
        },
    },
})

addLayer("ach", {
    name: "Achievements",
    symbol: "Ach",
    position: 0,
    row: "side",
    startData(){ return {
        unlocked: true,
    }},
    color: "yellow",
    layerShown() {return true},
    tooltip() {return ("Achievements")},

    // Don't know if this is necessary, but it breaks
    // tabFormat: [
    //     "blank", 
    //     ["display-text", function() { return "Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
    //     "blank", "blank",
    //     "achievements",
    // ],

    achievements: {
        rows: 2,
        cols: 4,
        11: {
            name: "The Start",
            done() {return player.ap.points.gt(0)},
            tooltip: "Get 1 Addition point.",
        },
        12: {
            name: "Nerfing Yourself",
            done() {return player.sp.points.gt(0)},
            tooltip: "Get 1 Subtraction point.",
        },
        13: {
            name: "Self boost",
            done() {return hasUpgrade("ap", 22)},
            tooltip: "Buy the sixth addition upgrade.",
        },
        14: {
            name: "It's not all bad",
            done() {return hasMilestone('sp', 1)},
            tooltip: "Get the second Subtraction milestone",
        },
        21: {
            name: "Counteracting the nerf",
            done() {return hasUpgrade('ap', 32)},
            tooltip: "Buy the tenth addition upgrade. Reward: Increase point gain by 20%",
        },

    }
})