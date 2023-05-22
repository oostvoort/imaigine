import { Dialog as DialogCore } from './base'
import React from 'react'
import { camelCaseToTitle } from '../lib/utils'

const { Dialog, DialogContent } = DialogCore

type Props = {
  isOpen: boolean
  setOpen: (val: boolean) => void
  avatarIcon: string
  playerName: string
  lvl: string
  description: string
  stats: Array<{
    name: string
    value: number
  }>
  skills: Array<string>
}

const SubContainer = ({ children }: { children: React.ReactNode }) => <div
  className="flex flex-col gap-3 flex-1 p-5 rounded-lg bg-night">{children}</div>

export default function AvatarStatsDialog({
  isOpen,
  setOpen,
  avatarIcon,
  playerName,
  lvl,
  description,
  stats,
  skills,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="flex gap-5 w-full sm:max-w-7xl border border-accent !rounded-2xl">
        <img src={avatarIcon} alt={String(avatarIcon)}
             className="h-[600px] rounded-xl aspect-[0.7] object-cover flex-grow-0" />
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex gap-5 flex-1">
            <div className="flex-1 flex flex-col gap-3">
              <p className="accent-title">Stats</p>
              <SubContainer>
                <p className="text-white text-xl font-bold">{playerName}</p>
                <p className="text-foreground text-md">LVL: {lvl}</p>
                <div className='grid grid-cols-2 gap-5 mt-5'>
                  {stats.map(stat => (
                    <p key={JSON.stringify(stat)} className="text-foreground text-md">{stat.name} : {stat.value}</p>
                  ))}
                </div>
              </SubContainer>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <p className="accent-title">Skills</p>
              <SubContainer>
                <div className='grid grid-cols-1 gap-5'>
                  {skills.map(skill => (
                    <p key={JSON.stringify(skill)} className="text-foreground text-md">{camelCaseToTitle(skill)}</p>
                  ))}
                </div>
              </SubContainer>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="accent-title">Description</p>
            <SubContainer>
              <p className="text-foreground text-md tracking-wide leading-relaxed">{description}</p>
            </SubContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
