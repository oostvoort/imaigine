import {CharacterStory} from 'types'

export interface PlayerStoryFormProps {
    story: CharacterStory;
    setStory: React.Dispatch<React.SetStateAction<CharacterStory>>;
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

export default PlayerStoryForm