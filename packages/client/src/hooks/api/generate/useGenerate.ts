import {useMutation} from "react-query";
import {
    fetchPostGenerateLocation,
    fetchPostGenerateNpc,
    fetchPostGeneratePlayer,
    fetchPostGenerateStory, fetchPostGenerateTravel
} from "./fetchGenerate";
import {
    RequestGenerateLocation, RequestGenerateNpc, RequestGeneratePlayer,
    RequestGenerateStory, RequestGenerateTravel,
    ResponseGenerateLocation, ResponseGenerateNpc, ResponseGeneratePlayer,
    ResponseGenerateStory, ResponseGenerateTravel
} from "./typesGenerate";

export default function useGenerate() {

    const postGenerateStory = useMutation<ResponseGenerateStory, Error, RequestGenerateStory>(async (data) => {
        return await fetchPostGenerateStory(data);
    }, {
        mutationKey: ["postGenerateStore"]
    });

    const postGenerateLocation = useMutation<ResponseGenerateLocation, Error, RequestGenerateLocation>(async (data) => {
        return await fetchPostGenerateLocation(data)
    }, {
        mutationKey: ["postGenerateLocation"]
    })

    const postGeneratePlayer = useMutation<ResponseGeneratePlayer, Error, RequestGeneratePlayer>(async (data) => {
        return await fetchPostGeneratePlayer(data)
    }, {
        mutationKey: ["postGeneratePlayer"]
    })

    const postGenerateNpc = useMutation<ResponseGenerateNpc, Error, RequestGenerateNpc>(async (data) => {
        return await fetchPostGenerateNpc(data)
    }, {
        mutationKey: ["postGenerateNpc"]
    })

    const postGenerateTravel = useMutation<ResponseGenerateTravel, Error, RequestGenerateTravel>(async (data) => {
        return await fetchPostGenerateTravel(data)
    }, {
        mutationKey: ["postGenerateTravel"]
    })

    return {
        postGenerateStory,
        postGenerateLocation,
        postGeneratePlayer,
        postGenerateNpc,
        postGenerateTravel
    }
}
