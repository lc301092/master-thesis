import { constants } from "../constants.js"

export const timeMachine =
[
    // Story progression 0
    {
        function: {
            a: -15,
            b: 2200,
        },
        destinations: [
            {
                sceneID: constants.SCENES.CHEMIST,
                year: 1930,
                text: 'ADVARSEL: \nDER ER GÅET ROD I MEDICINFREMSTILLINGEN! \nHJÆLP LABORANTEN MED AT VÆLGE DEN RETTE MEDICIN! \n\nÅRSTAL:[size=24][color=orange][b] 1930 [/b][/color][/size] \nMATEMATIK: STATISTIK'
            }
            //,{} if there were more storyprog 0  
        ]
    }
    ,
    // Story progression 1
    {
        function: {
            a: -9,
            b: 2200
        },
        destinations: [
            {
                sceneID: constants.SCENES.FARM,
                year: 1990,
                text: 'ADVARSEL: \n OPSKALERINGEN AF MEDICINUDVIKLING HAR FØRT TIL, AT DER SKAL DYRKES FLERE PLANTER TIL MEDICINBRUG. DU SKAL UD TIL LANDMÆND OG RÅDGIVE DEM I DYRKNING AF PLANTER. \n\nÅRSRTAL: [size=24][color=orange][b] 1990 [/b][/color][/size]\nMATEMATIK: STATISTIK OG LINEÆR REGRESSION '
            },
            // {
            //     sceneID: 'Placeholder scene',
            //     year: 2080,
            //     text: `Aktiv fremtidspolitijagt! \n Bejenten er stærkt optaget af at styre køretøjet, giv ham instrukser, så I kan indhente gerningsmanden \n\nÅRSTAL: [size=24][color=orange][b] 2080 [/b][/color][/size]`
            // }
            //,{} if there were more storyprog 1  
        ]
    },
    // Story progression 2
];