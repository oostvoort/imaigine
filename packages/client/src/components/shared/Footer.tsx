import React from 'react'

type Action = {
  id: string,
  description: string
}

type PropsType = {
  actions: Action[],
  onAction?: (actionId: string) => void
}

// right now we're limiting choices to three
const NUMBER_OF_CHOICES = 3

// TODO: figure out why this is causing an issue
// eslint-disable-next-line react/prop-types
const Footer: React.FC<PropsType> = ({ actions, onAction }) => {
  return (
    <div className={"flex lg:gap-20 md:gap-10 sm:gap-1 justify-center w-full sticky-footer"}>
      {/* eslint-disable-next-line react/prop-types */}

      { actions
          .filter((_, i) => i < NUMBER_OF_CHOICES)
          .map(({ id, description}) => (
            <div key={id} className={"bg-[#181C1E] border border-[#715600] w-full text-center p-3 rounded-lg"}>
              <div className={"bg-[#181C1E] border border-[#715600] w-full p-3 rounded-md"}>
                <button
                  onClick={() => {
                    if (onAction) onAction(id)
                  }}
                >
                  {description}
                </button>
              </div>
            </div>
          ))}
    </div>
  )
}

export default Footer
