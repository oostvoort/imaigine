import {useState} from "react";
import PlayerStatsDistributor, {initialStats} from "./components/PlayerStatsDistributor";
import PlayerStoryForm from "./components/PlayerStoryForm";
import {useMUD} from "../../MUDContext";
import {useMutation} from "@tanstack/react-query";
import env from "../../env";
import {CharacterStory} from "types";

export function CreatePlayer() {
    const {
        components: {CharacterStatsComponent, CharacterStoryComponent, Player},
        systemCalls: {createPlayerCharacter},
        network: {singletonEntity},
    } = useMUD();

    const generateStory = useMutation(['generate-story'], async () => {
            const res = await fetch(env.API_ENDPOINT + '/generateStory', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({stats, story})
            })
        }
    )

    const [stats, setStats] = useState<typeof initialStats>(initialStats);
    const [story, setStory] = useState<CharacterStory>({
        name: 'Lyra',
        age: 'adult',
        pet: 'dragon',
        food: 'taco',
        universe: 'Lord of the Rings',
        activity: 'climbing mountains',
        alignment: 'good',
    });

    return <div>
        <div className={"flex flex-row"}>
            <div>
                <PlayerStoryForm story={story} setStory={setStory}/>
            </div>
            <div>
                <PlayerStatsDistributor stats={stats} setStats={setStats}/>
            </div>
        </div>
        <div className="mt-4">
            <button
                onClick={() => {
                    generateStory.mutate()
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
                Generate Story!
            </button>
        </div>
    </div>;
}
