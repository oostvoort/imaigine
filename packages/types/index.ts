export interface CharacterStory {
    age: string;
    pet: string;
    food: string;
    activity: string;
    alignment: string;
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
