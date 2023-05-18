import _ from "lodash";
import {CharacterStat, CharacterStats} from 'types'


export interface StatDistributorProps {
    stats: typeof initialStats;
    setStats: React.Dispatch<React.SetStateAction<typeof initialStats>>;
}

export const initialStats: CharacterStats = {
    strength: 4,
    dexterity: 4,
    constitution: 4,
    intelligence: 4,
    charisma: 4,
    wisdom: 4
};

export const totalPoints = 27;

const PlayerStatsDistributor = ({stats, setStats}: StatDistributorProps) => {
    const handleIncrement = (stat: CharacterStat): void => {
        if (stats[stat] < 18 && getTotalPointsUsed() < totalPoints) {
            setStats((prevStats) => ({
                ...prevStats,
                [stat]: prevStats[stat] + 1
            }));
        }
    };

    const handleDecrement = (stat: CharacterStat): void => {
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
                        <div className="w-6">({getModifier(stats[stat as CharacterStat])})</div>
                        <button
                            onClick={() => handleDecrement(stat as CharacterStat)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                        >
                            -
                        </button>
                        <div className="mx-2 w-6 text-center">{stats[stat as CharacterStat]}</div>
                        <button
                            onClick={() => handleIncrement(stat as CharacterStat)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                            disabled={stats[stat as CharacterStat] === 18 || getTotalPointsUsed() >= totalPoints}
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

export default PlayerStatsDistributor