import {SetupNetworkResult} from "./setupNetwork";
import {ClientComponents} from "./createClientComponents";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    {worldSend}: SetupNetworkResult,
    {}: ClientComponents
): { createPlanet: (theme: string) => Promise<void> } {

    const createPlanet = async (theme: string) => {
        await worldSend("createPlanet", [theme])
    }

    return {
        createPlanet,
    };
}
