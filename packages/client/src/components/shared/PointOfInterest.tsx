import React from 'react'
import { clsx } from 'clsx'
import { generateIpfsImageLink } from '../../lib/utils'

type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

export default function PointOfInterest({ ...props }: Props) {
  return (
    <React.Fragment>
      <img
        {...props}
      />
    </React.Fragment>
  )
}
