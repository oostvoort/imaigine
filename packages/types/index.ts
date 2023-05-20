
export interface CharacterStory {
    pet: string;
    activity: string;
    history: string;
}

export interface CharacterPhysicalFeatures {
    ageGroup: string;
    race: string;
    height: string;
    body: string;
    hair: string;
    eyes: string;
}

export type CharacterStat = keyof CharacterStats;

export interface CharacterStats {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    charisma: number;
    wisdom: number;
}

export interface GenerateWorldProps {
    theme: string,
    races: Array<string>,
    currency: string,
    extraDescriptions: Array<string>,
}

export interface  GenerateLocationProps{
    world: { name: string, description: string },
    biome: string,
    naturalResources: string,
    wealthLevel: string,
    populationSize: string,
    safetyLevel: string,
}


export interface GenerateCharacterProps {
    stats: CharacterStats,
    story: CharacterStory,
    location: { name: string, description: string },
    world: { name: string, description: string },
    physicalFeatures: CharacterPhysicalFeatures,
}