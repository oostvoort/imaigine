

export interface GenerateWorldProps {
    theme: string,
    races: Array<string>,
    currency: string,
    extraDescriptions: Array<string>,
}

export interface  GenerateLocationProps{
    world: { name: string, summary: string },
    biome: string,
    naturalResources: string,
    wealthLevel: string,
    populationSize: string,
    safetyLevel: string,
}



export interface CharacterStory {
    favColor: "Green" | "Brown" | "Blue" | "White" | "Yellow" | "Grey" | "Red" | string
}

export interface CharacterPhysicalFeatures {
    ageGroup: string
    genderIdentity: string
    race: string
    bodyType: string
    height: string
    hairLength: string
    hairType: string
    hairColor: string
    eyeShape: string
    eyeColor: string
}

export type CharacterStat = keyof CharacterStats;

export interface CharacterStats {
    strength: string;
    dexterity: string;
    constitution: string;
    intelligence: string;
    charisma: string;
    wisdom: string;
}


export interface GeneratePlayerCharacterProps {
    stats: CharacterStats,
    story: CharacterStory,
    location: { name: string, summary: string },
    world: { name: string, summary: string },
    physicalFeatures: CharacterPhysicalFeatures,
}

export interface GenerateNonPlayerCharacterProps {
    stats: CharacterStats,
    location: { name: string, summary: string },
    world: { name: string, summary: string, races: Array<string> },
}