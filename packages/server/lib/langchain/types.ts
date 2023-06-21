export interface Location {
    name: string,
    description: string,
    visualSummary: string
}

export interface Based {
    name: string,
    description: string,
    visualSummary: string
}

export interface NonPlayerCharacterProps {
    storyName: string,
    storyDescription: string,
    locationName: string,
    locationDescription: string
}

export interface NonPlayerCharacterResponse extends Based{
    initialMessage: string
}

export interface PlayerCharacterProps extends NonPlayerCharacterProps {
    ageGroup: string,
    genderIdentity: string,
    race: string,
    skinColor: string,
    bodyType: string,
    favColor: string
}