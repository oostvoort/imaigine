import React from 'react'
import { useMutation } from '@tanstack/react-query'
import useGame from './useGame'
import { useMUD } from '../MUDContext'
import { hexZeroPad } from 'ethers/lib/utils'
import { useAtom } from 'jotai'
import { triggerRender_atom } from '../atoms/globalAtoms'

export default function usePlayerTravel() {
  const {
  systemCalls: {
    playerTravelPath
  }
  } = useMUD()
  const [t, setT] = useAtom(triggerRender_atom)

  return useMutation({
    mutationKey: ['playerTravel'],
    mutationFn: async (variables: any) => {

      const asyncFunction = (t: any) => new Promise(resolve => setTimeout(resolve, t));

      const getData = async (resolve: any, reject: any, count: any) => {

        await asyncFunction(1000);

        count++;

        if (count < 2) {
          await getData(resolve, reject, count);
        } else {
          return resolve();
        }
      }

      const runScript = async () => {
        await new Promise((r, j) => getData(r, j, 0));
        await playerTravelPath(hexZeroPad(variables.pathID, 32))
        console.log('finished');
      };

      await runScript();
    },
    onSettled: () => {
      setT(prev => prev += 1)
    },
    onSuccess: () => {
      console.log('player successfully travelled')
      setT(prev => prev += 1)
    },
    onError: (error) => {
      console.log(error)
    }
  })
}
