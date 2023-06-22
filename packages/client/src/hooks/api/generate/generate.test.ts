import {it, expect, jest} from '@jest/globals';
import {
    fetchPostGenerateLocation,
    fetchPostGenerateNpc,
    fetchPostGeneratePlayer,
    fetchPostGenerateStory, fetchPostGenerateTravel
} from "./fetchGenerate";
import {
    RequestGenerateLocation,
    RequestGenerateNpc,
    RequestGeneratePlayer,
    RequestGenerateTravel
} from "./typesGenerate";

 it("fetchPostGenerateStory", async () => {
    const mockResponse = { success: true };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockResponse),
        } as Response)
    );
    const data = { theme: "fantasy", races: ["human", "elf"] };
    const result = await fetchPostGenerateStory(data);
    expect(result).toEqual(mockResponse);
});

it("fetchPostGenerateLocation", async () => {
    const mockData: RequestGenerateLocation = {
        id: "123"
    }
    const mockResponse = {
        success: true,
        message: "Location generated successfully"
    }
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockResponse)
        }) as Promise<Response>
    );
    const result = await fetchPostGenerateLocation(mockData);
    expect(result).toEqual(mockResponse);
});

it("fetchPostGeneratePlayer", async () => {
    const mockData: RequestGeneratePlayer = {
        attributes: {
            name: "John",
            age: 25,
            gender: "male"
        }
    }

    const mockResponse = {
        success: true,
        message: "Player generated successfully"
    }

    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockResponse)
        }) as Promise<Response>
    )

    const result = await fetchPostGeneratePlayer(mockData)

    expect(result).toEqual(mockResponse)
})

it("fetchPostGenerateNpc", async () => {
    const mockData: RequestGenerateNpc = {
        id: "123",
        description: "Test NPC"
    }
    const mockResponse = { success: true }
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockResponse)
        }) as Promise<Response>
    )
    const result = await fetchPostGenerateNpc(mockData)
    expect(result).toEqual(mockResponse)
})

it("fetchPostGenerateTravel", async () => {
    const data: RequestGenerateTravel = {
        routeIds: [1, 2, 3],
        from: "New York",
        to: "Los Angeles"
    };

    const mockResponse = { success: true };
    jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockResponse)
        }) as Promise<Response>
    );

    const response = await fetchPostGenerateTravel(data);

    expect(response).toEqual(mockResponse);
});