import {MOCK_LOCATION} from "../global/constants";

interface Location {
    "name": string
    "summary": string,
    "imgHash": string,
    "id": string
}
export function getRandomLocation() : Location {
    const randomIndex = Math.floor(Math.random() * MOCK_LOCATION.length);
    return MOCK_LOCATION[randomIndex];
}