import { StartingLocation } from "types";
export function getRandomLocation(locations: Array<StartingLocation>): StartingLocation {
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
}
