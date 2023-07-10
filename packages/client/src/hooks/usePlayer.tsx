import {useMUD} from '@/MUDContext';
import {useComponentValue} from "@latticexyz/react"
import {useMutation} from '@tanstack/react-query'
import { SERVER_API } from '@/global/constants'
import {awaitStreamValue} from "@latticexyz/utils";
import { GeneratedPlayer, GeneratePlayer, GeneratePlayerProps, GeneratePlayerResponse } from '@/global/types'
import { getFromIPFS } from '@/global/utils'
import { useState } from 'react'
import { Entity } from '@latticexyz/recs'


export default function usePlayer () {
    const {
        components: {
            PlayerComponent,
            ConfigComponent,
            CharacterComponent,
            AliveComponent,
            ImageComponent,
            LocationComponent,
            KarmaPointsComponent,
            BattlePointsComponent,
        },

        network: {
            worldSend,
            txReduced$,
            playerEntity
        },
    } = useMUD();

    const [customPlayerId, setCustomPlayerId] = useState<Entity>()

    const getPlayerImage = useComponentValue(ImageComponent, customPlayerId)
    const getPlayerConfig = useComponentValue(ConfigComponent, customPlayerId)
    const getPlayerBattlePoints = useComponentValue(BattlePointsComponent, customPlayerId)

    const player = {
        id: playerEntity,
        player: useComponentValue(PlayerComponent, playerEntity),
        config: useComponentValue(ConfigComponent, playerEntity),
        character: useComponentValue(CharacterComponent, playerEntity),
        alive: useComponentValue(AliveComponent, playerEntity),
        image: useComponentValue(ImageComponent, playerEntity),
        location: useComponentValue(LocationComponent, playerEntity),
        karmaPoints: useComponentValue(KarmaPointsComponent, playerEntity),
        battlePoints: useComponentValue(BattlePointsComponent, playerEntity)
    }

    const generatePlayer = useMutation<Awaited<GeneratedPlayer>, Error, GeneratePlayerProps>(async (data) => {
        const response = await fetch(`${SERVER_API}/api/v1/generate-player`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const responseData = await response.json() as GeneratePlayerResponse;

        const getDataFromIPFS = await getFromIPFS(responseData.ipfsHash);

        const ipfsData = await getDataFromIPFS.json();

        return { ...responseData, ...ipfsData };
    }, {
        mutationKey: ["generatePlayer"],
    })


    const createPlayer = useMutation<typeof player, Error, GeneratePlayer>(async (data) => {
        const { config, imgHash, locationId } = data;
        const tx = await worldSend("createPlayer", [playerEntity ?? '', config, imgHash, locationId])
        await awaitStreamValue(txReduced$ , (txHash) => txHash === tx.hash)
        return player
    }, {
        mutationKey: ["createPlayer"],
    })

    return {
        player,
        generatePlayer,
        createPlayer,
        setCustomPlayerId,
        getPlayerImage,
        getPlayerConfig,
        getPlayerBattlePoints
    }
}


