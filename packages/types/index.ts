export interface CharacterStory {
    name: string;
    age: string;
    pet: string;
    food: string;
    universe: string;
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

export interface CurrentStoryStats {
    mapHex: 'not-sure-about-the-type-of-this-yet',
    gameStats: Record<string, Array<{
        label: string,
        img: string
    }>>,
    narration: string,
    actions: Array<{
        description: string,
        action: () => void
    }>
}