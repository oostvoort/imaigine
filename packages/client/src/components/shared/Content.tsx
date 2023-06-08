import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

type TargetType = {
  id: string,
  name: string,
  type: 'location' | 'npc' | 'item' | 'animal'
}

type PropsType = {
  img: {
    src: string,
    alt?: string
  }
  text: string,
  targets?: TargetType[],
  onTarget?: (target: TargetType) => void
}

type TargetProps = {
  definition: TargetType,
  onTarget?: (target: TargetType) => void
}

const targetVariants = cva(
  "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background font-jost",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        location: "text-[#FFBB00]",
        npc: "text-[#24E1FF]",
        item: "text-[#CDFF00]",
        animal: "text-[#FF4DFF]",
      },
      size: {
        sm: "h-9 px-3 rounded-md text-sm",
        default: "h-10 py-2 text-3xl font-amiri",
        lg: "h-12 px-8 py-8 rounded-lg text-lg",
        xl: "h-16 px-12 rounded-lg text-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// TODO: add tool tip on hover
const Target: React.FC<TargetProps> = ({ definition, onTarget }) => {
  return (
    <span
      className={cn(targetVariants({ variant: definition.type }))}
      onClick={() => {
        if (onTarget) onTarget(definition)
      }}
    >
    {definition.name}
    </span>
  )
}

const placeholder = '//@_.._!!!!PL5CEH0LDER!!!!_.._@//'

const replaceTargets = (text: string, targets: TargetType[], onTarget?: (target: TargetType) => void) => {
  const replacedText = targets.reduce((replacedText, target) => {
    return replacedText.replaceAll(target.name, `${placeholder}${target.name}${placeholder}`)
  }, text)
  return replacedText
    .split(placeholder)
    .map((text, index) => {
      const target = targets.find(target => target.name === text)
      if (target) {
        return <Target definition={target} onTarget={onTarget} key={index} />
      }
      return (
        <React.Fragment key={index}>{text}</React.Fragment>
      )
    })
}


const Content: React.FC<PropsType> = ({ img, text, targets, onTarget}) => {
  const targetedText = targets ? replaceTargets(text, targets, onTarget) : text
  return (
    <div className="flex w-full p-8">
      <div className="w-full h-[75vh] flex border border-[#715600] rounded-xl">
        <div className="w-6/12 h-full rounded-l-xl">
          <img
            src={img.src}
            alt={img.alt ?? "illustration of the text"}
            className={"w-full h-full rounded-l-xl"}
          />
        </div>
        <div className="w-6/12 h-full py-8 px-6 overflow-auto bg-[#222E37] rounded-r-xl">
          <p className="text-2xl font-amiri leading-10">{targetedText}</p>
        </div>
      </div>
    </div>
  )
}

export default Content
