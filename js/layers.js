addLayer("ap", {
    name: "Addition", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0)
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Addition points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = new Decimal(0.6)
        if (hasMilestone('sp', 1)) exp = exp.add(0.1)
            return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasMilestone('sp', 1)) mult = mult.mul(2)
        if (hasAchievement('ach', 22)) mult = mult.mul(1.5)
        if (hasUpgrade('mp', 12)) mult = mult.mul(2)
        if (player.dp.unlocked && player.dp.points.gte(1)) mult = mult.div(tmp.dp.effect)
        if (hasUpgrade('mp', 22)) mult = mult.mul(upgradeEffect('mp', 22))
        if (inChallenge('dp', 21) || inChallenge('dp', 22)) mult = mult.div(tmp.dp.challenges[21].effect)
        if (mult.lte(1) && !hasUpgrade('ap', 11)) mult = new Decimal(1)
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
                if (hasUpgrade("ap", 31)) eff = eff.add(upgradeEffect('ap', 31))
                if (hasUpgrade("ap", 34)) eff = eff.add(upgradeEffect('ap', 34))
                if (hasMilestone('mp', 1)) eff = eff.mul(tmp.mp.milestones[1].effect)
                if (hasUpgrade('mp', 33)) eff = eff.mul(upgradeEffect('mp', 33))
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[11].effect)},
            cost: new Decimal(1),
        },
        12: {
            title: "Add by 2",
            effect(){
                let eff = new Decimal(2)
                if (hasUpgrade("ap", 34)) eff = eff.add(upgradeEffect('ap', 34))
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
                if (hasUpgrade("ap", 34)) eff = eff.add(upgradeEffect('ap', 34))
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[13].effect)},
            cost: new Decimal(3),
            unlocked() {return hasUpgrade("ap", 12)},
        },
        14: {
            title: "Inverse operation",
            description: "Unlock Subtraction points",
            cost() {
                let c = new Decimal(5)
                if (hasUpgrade('mp', 14)) c = new Decimal(0)
                    return c
            },
            unlocked() {return hasUpgrade("ap", 13)},
        },
        21: {
            title: "Add by 5",
            effect(){
                let eff = new Decimal(5)
                if (hasUpgrade("ap", 34)) eff = eff.add(upgradeEffect('ap', 34))
                if (inChallenge('dp', 21) || inChallenge('dp', 22)) eff = eff.div(tmp.dp.challenges[21].effect)
                if (hasUpgrade('mp', 33)) eff = eff.mul(upgradeEffect('mp', 33))
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[21].effect)},
            cost: new Decimal(10),
            unlocked() {return hasMilestone("sp", 0) && hasUpgrade("ap", 14)},
        },
        22: {
            title: "Add by Points",
            description: "Increase point gain based on itself at a reduced rate",
            cost: new Decimal(15),
            effect() {
                let base = player.points.add(1)

                let power = new Decimal(0.15)
                if (hasMilestone('sp', 3)) power = power.add(0.05)

                let eff = base.pow(power).mul(5)
                if (hasUpgrade('ap', 34)) eff = eff.add(upgradeEffect('ap', 34))
                if (hasMilestone('sp', 3)) eff = eff.mul(1.5)
                if (inChallenge('dp',21) || inChallenge('dp', 22)) eff = eff.div(tmp.dp.challenges[21].effect)
                return eff
            },
            effectDisplay(){ return "+" +format(tmp.ap.upgrades[22].effect)},
            unlocked() {return hasUpgrade("ap", 21)},
        },
        23: {
            title: "Add by Addition Points",
            description: "Increase point gain based on Addition Points at a reduced rate",
            cost: new Decimal(20),
            effect() {

                let pow = new Decimal(0.4)
                if (hasUpgrade('ap', 33)) pow = pow.add(0.2)

                let eff = Decimal.pow(player.ap.points.mul(0.25).add(1), pow)
                if (hasUpgrade('ap', 33)) eff = eff.add(4).mul(1.4)
                eff = eff.mul(4)

                if (eff.gt(150)){
                    neff = new Decimal(150)
                    eff = eff.add(-150)
                    neff = neff.add(Decimal.pow(eff, 0.6))
                    eff = neff
                }
                if (hasUpgrade('ap', 34)) eff = eff.add(upgradeEffect('ap', 34))
                if (inChallenge('dp',21) || inChallenge('dp', 22)) eff = eff.div(tmp.dp.challenges[21].effect)
                return eff
            },
            effectDisplay(){ return "+" +format(tmp.ap.upgrades[23].effect)},
            unlocked() {return hasUpgrade("ap", 22)},
        },
        24: {
            title: "Add by 8",
            effect(){
                let eff = new Decimal(8)
                if (hasUpgrade("ap", 34)) eff = eff.add(upgradeEffect('ap', 34))
                if (inChallenge('dp',21) || inChallenge('dp', 22)) eff = eff.div(tmp.dp.challenges[21].effect)
                return eff
            },
            description() { return "Increase point gain by " +format(tmp.ap.upgrades[24].effect)},
            cost: new Decimal(30),
            unlocked() {return hasUpgrade("ap", 23)},
        },
        31: {
            title: "Return to the first",
            effect() {
                let eff = new Decimal(9)
                if (hasUpgrade('mp', 33)) eff = eff.mul(upgradeEffect('mp', 33))
                return eff
            },
            description() { return "Upgrade 1's effect is increased by " +format(upgradeEffect('ap', 31))},
            cost: new Decimal(80),
            unlocked() {return hasMilestone("sp", 1) && hasUpgrade('ap', 24)},
        },
        32: {
            title: "Add by Subtraction Points",
            description: "Increase point gain based on Subtraction points at an increased rate",
            cost: new Decimal(100),
            effect() {
                let eff = Decimal.pow(player.sp.points, 2).mul(2)
                if (hasUpgrade("ap", 34)) eff = eff.add(upgradeEffect('ap', 34))
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
            effect() {
                let eff = new Decimal(12)
                if (hasMilestone('mp', 3)) eff = eff.mul(1.5)
                if (hasUpgrade('mp', 34)) eff = eff.mul(upgradeEffect('mp', 34))
                return eff
            },
            description() { return "Every previous 'Add by' upgrade has its effect increased by  " +format(tmp.ap.upgrades[34].effect)},
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
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#f01e2c",
    requires: new Decimal(7), // Can be a function that takes requirement increases into account
    resource: "Subtraction points", // Name of prestige currency
    baseResource: "Addition points", // Name of resource prestige is based on
    baseAmount() {return player.ap.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    resetsNothing: true,
    branches: ["ap"],
    autoPrestige() {
        return hasMilestone('mp', 2) && player.sp.auto
    },
    unlocked() {
        return hasUpgrade('ap', 14)
    },
    effect() {

        // Base
        let base = new Decimal (player.sp.points)

        // Power
        let power = new Decimal(3)
        eff = base.pow(power)
        if (hasUpgrade('dp', 11)) eff = eff.div(upgradeEffect('dp', 11))
        if (hasUpgrade('mp', 24)) eff = eff.div(tmp.dp.effect)
        return eff
    },
    effectDescription() {
        return "which are reducing points by " +format(tmp.sp.effect)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(0.0075)
        if (hasChallenge('dp', 11)) mult = mult.div(3)
        return mult
    },
    directMult() {
        let dmult = new Decimal(1)
        return dmult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "s: Reset for Subtraction points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        let shown = hasUpgrade('ap', 14) || (player.sp.unlocked)
        return shown
    },

    // My milestones

    milestones: {
        0: {
            requirementDescription: "1 Subtraction point",
            effectDescription: "Unlock a new row of Addition upgrades",
            done() {return player.sp.points.gte(1)}
        },
        1: {
            requirementDescription: "2 Subtraction points",
            effectDescription: "Unlock a new row of Addition upgrades. Buff the Addition gain formula",
            done() {return player.sp.points.gte(2)},
            unlocked() {return hasMilestone('sp', 0)}
        },
        2: {
            requirementDescription: "3 Subtraction points",
            effectDescription: "Unlock the Multiplication Layer",
            done() {return player.sp.points.gte(3)},
            unlocked() {return hasMilestone('sp', 1)}
        },
        3: {
            requirementDescription: "4 Subtraction points",
            effect() {
                let base = player.sp.points
                let power = new Decimal(0.25)
                let eff = base.pow(power)
                eff = eff.sub(1)
                return eff
            },
            effectDescription() { return "Buff the sixth Addition upgrade. Subtraction points reduce division nerf by " +format(tmp.sp.milestones[3].effect)},
            done() {return player.sp.points.gte(4) && hasUpgrade('dp', 14)},
            unlocked() {return hasUpgrade('dp', 14) && hasMilestone('sp', 2)}
        },
    },
})

addLayer("mp", {
    name: "Multiplication",
    symbol: "M",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0),
    }},
    color: "orange",
    requires: new Decimal(3), // Can be a function that takes requirement increases into account
    resource: "Multiplication points", // Name of prestige currency
    baseResource: "Subtraction points", // Name of resource prestige is based on
    baseAmount() {return player.sp.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    branches: ["sp"],
    unlocked() {
        return hasMilestone('sp', 2)
    },
    effect() {

        // Base
        let base = new Decimal(player.mp.points)
        if (hasUpgrade('mp', 32)) base = base.mul(1.5)
        // Power
        let power = new Decimal(0.3)
        if (hasUpgrade('mp', 32)) power = power.add(0.3)
        let eff = base.pow(power)
        if (hasUpgrade('mp', 32)) eff = eff.mul(upgradeEffect('mp', 32))
        eff = eff.add(1)

        return eff
    },
    effectDescription() {
        return "which are multiplying points by x" +format(tmp.mp.effect)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasMilestone('mp', 0)) mult = mult.mul(1.2)
        if (hasAchievement('ach', 32)) mult = mult.mul(1.1)
        if (hasUpgrade('mp', 23)) mult = mult.mul(upgradeEffect('mp', 23))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(3)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)

    layerShown(){return player.mp.unlocked || hasMilestone('sp', 2)},
    hotkeys: [
        {key: "m", description: "m: Reset for Multiplication points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "upgrades"
            ]
        },
        "Milestones": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "milestones"
            ]
        },
    },


    milestones: {
        0: {
            requirementDescription: "1 total Multiplication point",
            effect(){
                let eff = new Decimal(1.2)
                return eff
            },
            effectDescription: "Multiply Multiplication points by 1.2",
            done() {return player.mp.total.gte(1)}
        },
        1: {
            requirementDescription: "2 total Multiplication points",
            effect(){
                let eff = new Decimal(2)
                return eff
            },
            effectDescription: "Multiply Addition upgrade 1's effect by 2",
            done() {return player.mp.total.gte(2)},
            unlocked() {return hasMilestone('mp', 0)}
        },
        2: {
            requirementDescription: "5 total Multiplication points",
            effectDescription: "Automatically reset for subtraction points",
            toggles: [['sp', 'auto']],
            done() {return player.mp.total.gte(5)},
            unlocked() {return hasMilestone('mp', 1)}
        },
        3: {
            requirementDescription: "20 total Multiplication points",
            effectDescription: "Multiply 'Super boost' effect by 1.5",
            done() {return player.mp.total.gte(20)},
            unlocked() {return hasMilestone('mp', 2)}
        },
        4: {
            requirementDescription: "75 total Multiplication points",
            effectDescription: "Buff the sixth Multiplication upgrade",
            done() {return player.mp.total.gte(75) && hasUpgrade('mp', 22)},
            unlocked() {return hasMilestone('mp', 3) && hasUpgrade('mp', 22)}
        },
        5: {
            requirementDescription: "5000 total Multiplication points",
            effectDescription: "Unlock Exponentiation (NYI)",
            done() {return player.mp.total.gte(5000)},
            unlocked() {return hasMilestone('mp', 4)}
        },

    },

    upgrades: {
        11: {
            title: "Multiply by 1",
            effect(){
                let eff = new Decimal(1)
                if (hasUpgrade('mp', 31)) eff = eff.mul(upgradeEffect('mp', 31))
                return eff
            },
            description() { return "Multiply point and Addition point (AP) gain by " +format(tmp.mp.upgrades[11].effect)},
            cost: new Decimal(1),
        },
        12: {
            title: "Multiply by 2",
            effect(){
                let eff = new Decimal(2)
                if (hasUpgrade('mp', 31)) eff = eff.mul(upgradeEffect('mp', 31))
                return eff
            },
            description() { return "Multiply point and AP gain by " +format(tmp.mp.upgrades[12].effect)},
            cost: new Decimal(2),
            unlocked() {return hasUpgrade('mp', 11)}
        },
        13: {
            title: "Multiply by 3",
            effect(){
                let eff = new Decimal(3)
                if (hasUpgrade('mp', 31)) eff = eff.mul(upgradeEffect('mp', 31))
                return eff
            },
            description() { return "Multiply point gain by " +format(tmp.mp.upgrades[13].effect)},
            cost: new Decimal(3),
            unlocked() {return hasUpgrade('mp', 12)}
        },
        14: {
            title: "Inverse Operation+",
            description() { return "Unlock Division points. 'Inverse Operation' cost is 0"},
            cost: new Decimal(6),
            unlocked() {return hasUpgrade('mp', 13)}
        },
        21: {
            title: "Less of a nerf",
            description() { return "Division upgrade 2 is based on total division points"},
            cost: new Decimal(6),
            unlocked() {return hasUpgrade('dp', 14)}
        },
        22: {
            title: "Multiply by Points",
            effect(){
                let base = player.points.add(1)

                let logbase = new Decimal(10)
                if (hasMilestone('mp', 4)) logbase = logbase.sub(2)
                let eff = base.log(logbase)
                eff = eff.div(3)
                if (hasUpgrade('mp', 31)) eff = eff.mul(upgradeEffect('mp', 31))
                eff = eff.add(1)
                return eff
            },
            description() { return "Unlock a Multiplication milestone and multiply AP gain based on points at a reduced rate"},
            effectDisplay() {return "x" +format(upgradeEffect('mp', 22))},
            cost: new Decimal(15),
            unlocked() {return hasUpgrade('mp', 21)}
        },
        23: {
            title: "Multiply by MP",
            effect(){
                let base = player.mp.points.add(1)

                let power = new Decimal(0.2)

                let eff = base.pow(power)
                eff = eff.sub(1)
                eff = eff.div(5)
                if (hasUpgrade('mp', 31)) eff = eff.mul(upgradeEffect('mp', 31))
                eff = eff.add(1)

                return eff
            },
            description() { return "Multiply MP gain based on itself at a heavily reduced rate"},
            effectDisplay() {return "x" +format(upgradeEffect('mp', 23))},
            cost: new Decimal(20),
            unlocked() {return hasUpgrade('mp', 22)}
        },
        24: {
            title: "Inverse Operation+++",
            description() { return "Unlock Division challenges. The subtraction nerf is divided by the division nerf"},
            cost: new Decimal(30),
            unlocked() {return hasUpgrade('mp', 23)}
        },
        31: {
            title: "Super boost 2",
            effect() {
                let eff = new Decimal(3)
                return eff
            },
            description() { return "Every previous 'Multiply by' upgrade has its effect multiplied by " +format(upgradeEffect('mp', 31))},
            cost: new Decimal(50),
            unlocked() {return hasUpgrade('mp', 24) && hasChallenge('dp', 22)}
        },
        32: {
            title: "Multiply by MP more",
            effect() {
                let base = player.mp.total.add(1)
                let power = new Decimal(0.2)
                let eff = base.pow(power)
                eff = eff.mul(1.5)
                return eff
            },
            description() { return "MP effect formula is buffed and it is boosted based on total MP"},
            effectDisplay() { return "x" +format(upgradeEffect('mp', 32))},
            cost: new Decimal(500),
            unlocked() {return hasUpgrade('mp', 31)}
        },
        33: {
            title: "First column booster",
            effect() {
                let base = player.ap.points.add(1)
                let logbase = new Decimal(8)
                logbase = logbase.div(base.log(100))
                if (logbase.lte(2)) logbase = new Decimal(2)
                let eff = base.log(logbase)
                eff = eff.mul(1.5)
                eff = eff.add(1)
                return eff
            },
            description() { return "First column of AP upgrades is multiplied based on AP"},
            effectDisplay() { return "x" +format(upgradeEffect('mp', 33))},
            cost: new Decimal(1000),
            unlocked() {return hasUpgrade('mp', 32)}
        },
        34: {
            title: "Super boost boost",
            effect() {
                let base = player.mp.points.add(1)
                let logbase = new Decimal(2)
                let eff = base.log(logbase)
                eff = eff.pow(1.75)
                eff = eff.mul(2)
                eff = eff.add(1)
                return eff
            },
            description() { return "Multiply 'Super Boost' effect based on total MP"},
            effectDisplay() { return "x" +format(upgradeEffect('mp', 34))},
            cost: new Decimal(1500),
            unlocked() {return hasUpgrade('mp', 33)}
        },
    },





})

addLayer("dp", {
    name: "Division", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        total: new Decimal(0)
    }},
    color: "#0E4C92",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "Division points", // Name of prestige currency
    baseResource: "Addition points", // Name of resource prestige is based on
    baseAmount() {return player.ap.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    resetsNothing: false,
    branches: ["ap", 'mp'],
    unlocked() {
        return hasUpgrade('mp', 14)
    },
    effect() {

        // Base
        let base = new Decimal (player.dp.total)
        base = base.add(1)

        // Power
        let power = new Decimal(0.6)
        let pointy = player.points.add(1)
        if (hasUpgrade('dp', 13)) pointy = pointy.div(upgradeEffect('dp', 13))
        power = power.add((pointy.add(1)).pLog10().div(25))
        let eff = base.pow(power)
        if (player.points.lte(10000)){
            let divi = player.points
            divi = divi.sub(10000).mul(-1)
            eff = eff.sub(1)
            eff = eff.div(divi.log(10).div(2))
            eff = eff.add(1)
        }
        if (hasMilestone('sp', 3)) eff = eff.sub(tmp.sp.milestones[3].effect)
        if (hasChallenge('dp', 12)) eff = eff.div(tmp.dp.challenges[12].rewardEffect)
        if (eff.lte(1)) eff = new Decimal(1)
        return eff
    },
    effectDescription() {
        return "which are dividing points and AP by " +format(tmp.dp.effect)+ " (boosted by points)"
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    directMult() {
        let dmult = new Decimal(1)
        return dmult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "d: Reset for Division points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        let shown = hasUpgrade('mp', 14) || (player.dp.unlocked)
        return shown
    },

    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "upgrades"
            ]
        },
        "Challenges": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "challenges"
            ],
            unlocked() {return hasUpgrade('mp', 24)}
        },
    },

    upgrades: {
        11: {
            title: "Divide by 1.25",
            effect() {
                let eff = new Decimal(1.25)
                if (hasChallenge('dp', 21)) eff = eff.mul(tmp.dp.challenges[21].rewardEffect)
                return eff
            },
            description() { return "Divide Subtraction points nerf by " +format(tmp.dp.upgrades[11].effect)},
            cost: new Decimal(1),
        },
        12: {
            title: "Divide by division",
            effect() {
                let base = player.dp.points.add(1)
                if (hasUpgrade('mp', 21)) base = player.dp.total

                let power = new Decimal(0.2)

                let eff =  base.pow(power)
                if (hasChallenge('dp', 21)) eff = eff.mul(tmp.dp.challenges[21].rewardEffect)

                return eff
            },
            description() { return "Divide Subtraction points nerf by divison points at a reduced rate"},
            effectDisplay() {return '/' +format(tmp.dp.upgrades[12].effect)},
            cost: new Decimal(1),
            unlocked() {return hasUpgrade('dp', 11)}
        },
        13: {
            title: "Divide by division again",
            effect() {
                let base = new Decimal(player.dp.points).add(4)
                base = base.mul(player.dp.points.pow(0.5).add(1))
                let power = new Decimal(3)
                let eff = base.pow(power)
                eff = eff.mul(5)
                if (hasChallenge('dp', 21)) eff = eff.mul(tmp.dp.challenges[21].rewardEffect)
                return eff
                
            },
            description() {return "Divide effective points in division nerf based on total division points"},
            effectDisplay() {return '/' +format(tmp.dp.upgrades[13].effect)},
            cost: new Decimal(3),
            unlocked() {return hasUpgrade('dp', 12)}
        },
        14: {
            title: "Inverse operation++",
            description: "Unlock a new row of Multiplication upgrades and a Subtraction milestone",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade('dp', 13)}
        }
    },

    challenges: {
        11: {
            name: "Divide by 20",
            challengeDescription: "Divide point gain by 20",
            canComplete() {return player.ap.points.gte(100)},
            goalDescription: "Get 100 Addition points",
            rewardDescription: "Divide Subtraction requirement by 3"
        },
        12: {
            name: "Divide by points",
            effect() {
                let base = player.points.add(1)
                let power = new Decimal(0.55)
                let eff = base.pow(power)
                return eff
            },
            challengeDescription() {return "Divide Point gain based on itself by /" +format(tmp.dp.challenges[12].effect)},
            canComplete() {return player.sp.points.gte(4)},
            goalDescription: "Get 4 Subtraction points",
            rewardEffect() {
                let base = player.mp.points.add(1)
                let power = new Decimal(0.25)
                let eff = base.pow(power)
                eff = eff.div(1.5)
                return eff
            },
            rewardDescription: "Divide Division nerf based on Multiplication points",
            rewardDisplay() { return "/" + format(tmp.dp.challenges[12].rewardEffect)},
            unlocked() {return hasChallenge('dp', 11)}
        },
        21: {
            name: "Divide by AP",
            effect() {
                let base = player.ap.total.add(1)
                let power = new Decimal(0.35)
                let eff = base.pow(power)
                return eff
            },
            challengeDescription() {return "Divide AP gain and 2nd row of AP upgrades based on total AP by /" +format(tmp.dp.challenges[21].effect)},
            canComplete() {return player.sp.points.gte(3)},
            goalDescription: "Get 3 Subtraction Points",
            rewardEffect() {
                let base = player.sp.points.add(1)
                let power = new Decimal(0.75)
                let eff = base.pow(power)
                return eff
            },
            rewardDescription: "Divide the first three Division upgrades' effects based on SP",
            rewardDisplay() { return "/" + format(tmp.dp.challenges[21].rewardEffect)},
            unlocked() {return hasChallenge('dp', 12)}
        },
        22: {
            name: "Divide by all",
            challengeDescription() {return "Trapped in all previous challenges"},
            canComplete() {return player.ap.total.gte(50)},
            goalDescription: "Get 50 total Addition points",
            rewardDescription: "Unlock a new row of Multiplication upgrades",
            unlocked() {return hasChallenge('dp', 21)}
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

    achievements: {
        rows: 10,
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
        22: {
            name: "1K",
            done() {return player.points.gte(1000)},
            tooltip: "Get 1000 points",
        },
        23:{
            name: "Why would you buy this",
            done() {return hasUpgrade('mp', 11)},
            tooltip: "Buy the first multiplication upgrade. Reward: Increase AP gain by 50%"
        },
        24: {
            name: "First Automation",
            done() {return hasMilestone('mp', 2)},
            tooltip: "Get the third Multiplication Milestone",
        },
        31: {
            name: "Not that useful",
            done() {return hasUpgrade('dp', 11)},
            tooltip: "Get the first division upgrade",
        },
        32: {
            name: "A little more useful",
            done() {return hasUpgrade('dp', 13)},
            tooltip: "Get the third division upgrade. Reward: Increase MP gain by 10%"
        },
        33: {
            name: "Self boosting",
            done() {return hasUpgrade('mp', 23)},
            tooltip: "Get the seventh multiplication upgrade. Reward: Multiply point by 2"
        },
        34: {
            name: "I thought multiplication was supposed to multiply",
            done() {return hasChallenge('dp', 12)},
            tooltip: "Complete the second Division challenge."
        },

    }
})