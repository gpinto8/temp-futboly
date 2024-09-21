export type GeneralItemProps = {
    title: string;
    desc: string;
};

export type RulesPairListProps = GeneralItemProps[];

export const getMatchBonus = () => {
    return [
        [{
            title: 'Goals Scored',
            desc: '+3'
        }, {
            title: 'Own Goal',
            desc: '-2'
        }, {
            title: 'Yellow Card',
            desc: '-0.5'
        }],
        [{
            title: 'Penalty Scored',
            desc: '+3'
        }, {
            title: 'Penalty Missed',
            desc: '-3'
        }, {
            title: 'Red Card',
            desc: '-1'
        }],
        [{
            title: 'Assist',
            desc: '+1'
        }, {
            title: 'Clean Sheet',
            desc: '+1'
        }, {
            title: 'Conceited Goal',
            desc: '+1'
        }]
    ];
};

export const getGoalRanges = () => {
    return [{
        title: "0 Goals",
        desc: "0 - 65"
    }, {
        title: "1 Goal",
        desc: "66 - 71"
    }, {
        title: "2 Goals",
        desc: "72 - 76"
    }, {
        title: "3 Goals",
        desc: "77 - 81"
    }, {
        title: "4 Goals",
        desc: "82 - 85"
    }, {
        title: "5+ Goals",
        desc: "+3 for each"
    }];
};

export const getFormations = () => {
    return [{
        title: "Classic Positions",
        desc: ["442", "451", "433", "343", "352", "361", "424", "334"]
    }, {
        title: "Speficic Positions",
        desc: ["343", "3412", "3421", "352", "3511", "433", "4312", "442", "4141", "4411", "4231"]
    }];
};