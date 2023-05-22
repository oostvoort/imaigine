import React from 'react'
import { Button, Dialog as DialogCore } from './base'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import copyIcon from '../assets/bx-copy.png'

const { Dialog, DialogContent } = DialogCore

type Props = {
  name: string
  privateKey: string,
  isOpen: boolean,
  setOpen: (value: boolean) => void
}

export default function SettingsDialog({ isOpen, setOpen, privateKey, name }: Props) {
  const [ isCopied, setIsCopied ] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!isOpen) setIsCopied(false)
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-5 w-full sm:max-w-4xl border border-accent !rounded-2xl">
        <p className="accent-title">Settings</p>
        <p className="font-bold text-md tracking-wide">Private Key : {name}</p>
        <p className="text-foreground text-sm break-words">{privateKey}</p>
        <CopyToClipboard text={privateKey} onCopy={() => {
          setIsCopied(true)
        }}>
          <Button variant="ghost" className="w-max text-white mx-auto">
            <img src={copyIcon} alt={String(copyIcon)}
                 className="w-4 my-auto mr-3" />
            {isCopied ? 'Copied' : 'Copy Private Key'}
          </Button>
        </CopyToClipboard>
        <Button className="w-max px-10 mx-auto px-20" size="xl">Logout</Button>
      </DialogContent>
    </Dialog>
  )
}
