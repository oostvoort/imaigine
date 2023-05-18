import {useComponentValue} from "@latticexyz/react";
import {useMUD} from "./MUDContext";
import {useState} from "react";
import _ from "lodash";
import env from "./env";
import {useMutation} from "wagmi";

interface PlayerStory {
    name: string;
    age: string;
    pet: string;
    food: string;
    universe: string;
    activity: string;
    alignment: string;
}

interface PlayerStoryFormProps {
    story: PlayerStory;
    setStory: React.Dispatch<React.SetStateAction<PlayerStory>>;
}

const PlayerStoryForm = ({story, setStory}: PlayerStoryFormProps) => {
    const handleInputChange = (event: any) => {
        const {id, value} = event.target;
        setStory((prevStory) => ({
            ...prevStory,
            [id]: value,
        }));
    };

    return (
        <div className="container mx-auto p-4">
            <label htmlFor="name" className="block">Character Name</label>
            <input
                value={story.name}
                id="name"
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-2"
                onChange={handleInputChange}
            />
            <label htmlFor="age" className="block">Age</label>
            <input
                value={story.age}
                id="age"
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-2"
                onChange={handleInputChange}
            />
            <label htmlFor="pet" className="block">Pet</label>
            <input
                value={story.pet}
                id="pet"
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-2"
                onChange={handleInputChange}
            />
            <label htmlFor="food" className="block">Food</label>
            <input
                value={story.food}
                id="food"
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-2"
                onChange={handleInputChange}
            />
            <label htmlFor="universe" className="block">Universe (fantasy, cyberpunk)</label>
            <input
                value={story.universe}
                id="universe"
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-2"
                onChange={handleInputChange}
            />
            <label htmlFor="activity" className="block">Favorite activity</label>
            <input
                value={story.activity}
                id="activity"
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-2"
                onChange={handleInputChange}
            />
            <label htmlFor="alignment" className="block">Alignment (good, evil)</label>
            <input
                value={story.alignment}
                id="alignment"
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-2"
                onChange={handleInputChange}
            />
            <hr className="my-4"/>
            <div id="story"></div>
        </div>
    );
}

type Stat = keyof typeof initialStats;

interface StatDistributorProps {
    stats: typeof initialStats;
    setStats: React.Dispatch<React.SetStateAction<typeof initialStats>>;
}

const initialStats = {
    strength: 4,
    dexterity: 4,
    constitution: 4,
    intelligence: 4,
    charisma: 4,
    wisdom: 4
};

const totalPoints = 27;


const PlayerStatsDistributor = ({stats, setStats}: StatDistributorProps) => {
    const handleIncrement = (stat: Stat): void => {
        if (stats[stat] < 18 && getTotalPointsUsed() < totalPoints) {
            setStats((prevStats) => ({
                ...prevStats,
                [stat]: prevStats[stat] + 1
            }));
        }
    };

    const handleDecrement = (stat: Stat): void => {
        if (stats[stat] > 4) {
            setStats((prevStats) => ({
                ...prevStats,
                [stat]: prevStats[stat] - 1
            }));
        }
    };

    const getTotalPointsUsed = (): number => {
        return Object.values(stats).reduce((total, stat) => total + stat - 4, 0);
    };

    const getModifier = (stat: number): number => {
        return Math.floor((stat - 10) / 2);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col items-start">
                {Object.keys(stats).map((stat) => (
                    <div key={stat} className="flex flex-row gap-4 items-center">
                        <div className="w-24">{_.capitalize(stat)}</div>
                        <div className="w-6">({getModifier(stats[stat as Stat])})</div>
                        <button
                            onClick={() => handleDecrement(stat as Stat)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            -
                        </button>
                        <div className="mx-2 w-6 text-center">{stats[stat as Stat]}</div>
                        <button
                            onClick={() => handleIncrement(stat as Stat)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                            disabled={stats[stat as Stat] === 18 || getTotalPointsUsed() >= totalPoints}
                        >
                            +
                        </button>
                    </div>
                ))}
            </div>
            <div className={'my-4'}>Total Points Used: {getTotalPointsUsed()}</div>
        </div>
    );
};

export const App = () => {
    const {
        components: {CharacterStatsComponent, CharacterStoryComponent, Player},
        systemCalls: {createPlayerCharacter},
        network: {singletonEntity},
    } = useMUD();

    const [stats, setStats] = useState<typeof initialStats>(initialStats);
    const [story, setStory] = useState<PlayerStory>({
        name: 'Lyra',
        age: 'adult',
        pet: 'dragon',
        food: 'taco',
        universe: 'Lord of the Rings',
        activity: 'climbing mountains',
        alignment: 'good',
    });


    const generateStory = useMutation(['generate-story'], async () => {
            const res = await fetch(env.API_ENDPOINT + '/genesis', {
                body: JSON.stringify({stats, story})
            })
        }
    )

    return (
        <div>
            <div className={'flex flex-row'}>
                <div>
                    <PlayerStoryForm story={story} setStory={setStory}/>
                </div>
                <div>
                    <PlayerStatsDistributor stats={stats} setStats={setStats}/>
                </div>
            </div>
            <div className="mt-4">
                <button
                    onClick={generateStory}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Generate Story!
                </button>
            </div>
        </div>
    );
};
