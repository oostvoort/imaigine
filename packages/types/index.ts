export interface GenerateStoryProps {
    theme: string,
    races: Array<string>,
    currency: string,
    extraDescriptions?: Array<string>,
}

export interface GenerateLocationProps {
    story: { name: string, summary: string },
}

export interface GenerateLocationProps {
    story: { name: string, summary: string },
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
    characterStats: CharacterStats,
    characterStory: CharacterStory,
    location: { name: string, summary: string },
    story: { name: string, summary: string },
    physicalFeatures: CharacterPhysicalFeatures,
}

export interface GenerateNonPlayerCharacterProps {
    stats: CharacterStats,
    location: { name: string, summary: string },
    story: { name: string, summary: string, races: Array<string> },
}

export interface GeneratePlayerCharacterResponse {
    name: string,
    summary: string,
    initialMessage: string,
    closingMessage: string,
    visualSummary: string,
    imageHash: string
}

export interface JsonResponse {
    name: string,
    summary: string
}

export interface GeneratePathProps {
    toLocation: { name: string, summary: string },
    fromLocation: { name: string, summary: string },
}
