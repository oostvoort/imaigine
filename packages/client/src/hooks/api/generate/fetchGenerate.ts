import {
    RequestGenerateLocation,
    RequestGenerateNpc,
    RequestGeneratePlayer,
    RequestGenerateStory, RequestGenerateTravel
} from "./typesGenerate";

const server_api = "http://localhost:3000/mock"

export const fetchPostGenerateStory = async (data: RequestGenerateStory) => {
    const response = await fetch(
        `${server_api}/api/v1/generate-story`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );
    return await response.json();
}

export const fetchPostGenerateLocation = async (data: RequestGenerateLocation) => {
    const response = await fetch(
        `${server_api}/api/v1/generate-location`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    return await response.json()
}

export const fetchPostGeneratePlayer = async (data: RequestGeneratePlayer) => {
    const response = await fetch(
        `${server_api}/api/v1/generate-player`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    return await response.json()
}

export const fetchPostGenerateNpc = async (data: RequestGenerateNpc) => {
    const response = await fetch(
        `${server_api}/api/v1/generate-npc`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    return await response.json()
}

export const fetchPostGenerateTravel = async (data: RequestGenerateTravel) => {
    const response = await fetch(
        `${server_api}/api/v1/generate-travel`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    return await response.json()
}