import React from 'react'
import { useMUD } from '@/MUDContext'
import { useComponentValue } from "@latticexyz/react"
import { Entity } from "@latticexyz/recs"
import { useMutation } from 'react-query'
import { SERVER_API } from '@/global/constants'
import { GeneratedLocation, GenerateLocation, GenerateLocationProps, GenerateLocationResponse } from '@/global/types'
import { getFromIPFS } from '@/global/utils'
import { awaitStreamValue } from '@latticexyz/utils'
import { hexZeroPad } from 'ethers/lib/utils'

export default function useLocation(locationIdParam?: Entity) {
  const {
    components: {
      ConfigComponent,
      SceneComponent,
      ImageComponent,
      InteractionTypeComponent,
    },

    network: {
      worldSend,
      txReduced$,
    }
  } = useMUD()

 const [locationId, setLocationId] = React.useState<Entity>(hexZeroPad("0x21", 32) as Entity);
 React.useEffect(() => {
  if (locationIdParam !== locationId && locationIdParam !== undefined) {
    setLocationId(locationIdParam);
  }
}, [locationId, locationIdParam]);

 const location = {
   config: useComponentValue(ConfigComponent, locationId),
   scene: useComponentValue(SceneComponent, locationId),
   imgHash: useComponentValue(ImageComponent, locationId),
   interactionType: useComponentValue(InteractionTypeComponent, locationId),
 }

  const generateLocation = useMutation<Awaited<GeneratedLocation>, Error, GenerateLocationProps>(async (data) => {
    const response = await fetch(`${SERVER_API}/api/v1/generate-location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json() as GenerateLocationResponse

    const getDataFromIPFS = await getFromIPFS(responseData.ipfsHash);

    const ipfsData = await getDataFromIPFS.json();

    return { ...responseData, ...ipfsData }
  }, {
    mutationKey: ["generateLocation"]
  })

  const createLocation = useMutation<typeof location, Error, GenerateLocation>(async (data) => {
    const { config, imgHash, locationId } = data
    const tx = await worldSend("createLocation", [config, imgHash, locationId])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)

    return location
  }, {
    mutationKey: ["createLocation"],
  })

  return {
    setLocationId,
    locationId,
    location,
    generateLocation,
    createLocation
  }
}
