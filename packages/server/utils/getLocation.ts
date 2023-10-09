import {MOCK_LOCATION_IDS} from "../global/constants";
export async function getLocation(locationId: string) {
    for (let i = 0; i < MOCK_LOCATION_IDS.length; i++) {
        const entry = MOCK_LOCATION_IDS[i];
        const key = Object.keys(entry)[0];
        if (key === locationId) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return entry[key];
        }
    }
    return "Location not found";
}