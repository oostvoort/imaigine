import React from 'react'
import { useMUD } from '@/MUDContext'
import { useComponentValue } from "@latticexyz/react"
import { Entity } from "@latticexyz/recs"
import { useMutation } from '@tanstack/react-query'
import { SERVER_API } from '@/global/constants'
import {
  GeneratedLocation,
  GenerateLocation,
  GenerateLocationProps,
  GenerateLocationResponse, LocationParam,
} from '@/global/types'
import { getFromIPFS, parseCellToLocationId } from '@/global/utils'
import { awaitStreamValue } from '@latticexyz/utils'
// import { hexZeroPad, keccak256, solidityPack } from 'ethers/lib/utils'

// const cellNumberToId = (cellNumber: number) => {
//   return (
//     keccak256(
//       solidityPack(
//         ['bytes16', 'uint256'],
//         ['0x4c4f434154494f4e0000000000000000', cellNumber]
//       )
//     )
//   )
// }
// INFO: already in utils named parseCellToLocationId()

export default function useLocation(locationIdParam?: LocationParam) {
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


  const [locationNumber, setLocationNumber] = React.useState<LocationParam>(0);

  React.useEffect(() => {
    if (locationIdParam !== locationNumber && locationIdParam !== undefined) {
      if (typeof locationIdParam === "number") {
        setLocationNumber(parseCellToLocationId(Number(locationIdParam)));
      }

      if (typeof locationIdParam === "string") {
        setLocationNumber(locationIdParam);
      }
    }
  }, [locationNumber, locationIdParam]);


 const location = {
   config: useComponentValue(ConfigComponent, locationNumber as Entity),
   scene: useComponentValue(SceneComponent, locationNumber as Entity),
   imgHash: useComponentValue(ImageComponent, locationNumber as Entity),
   interactionType: useComponentValue(InteractionTypeComponent, locationNumber as Entity),
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
    const { config, imgHash, locationNumber } = data
    const tx = await worldSend("createLocation", [config, imgHash, locationNumber])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)

    return location
  }, {
    mutationKey: ["createLocation"],
  })

  return {
    setLocationNumber,
    locationNumber,
    location,
    generateLocation,
    createLocation
  }
}
