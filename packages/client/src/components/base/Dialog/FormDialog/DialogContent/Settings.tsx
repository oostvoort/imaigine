import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'

export default function Settings() {
  return (
    <div className={clsx([ 'md:w-[622px]  h-full w-full', 'p-sm' ])}>
      <h3 className={clsx([ 'text-accent text-jost', 'uppercase tracking-[1.4px] font-medium', 'mb-sm' ])}>History</h3>

      <div
        className={clsx([ 'flex items-center justify-between', 'w-full', 'text-option-11 text-xl', 'leading-8 tracking-[0.4px] font-segoe' ])}>
        <p>Private Key: Alice</p>
        <p>Kj34GkxF...3okCIBOs</p>
      </div>

      <div className={clsx([ 'my-lg', 'flex justify-center'])}>
        <Button className={clsx(['flex items-center justify-center gap-2', 'bg-transparent', 'text-option-8 text-xl', 'leading-8 font-segoe font-semibold', 'hover:bg-transparent'     ])}>
          <img src={'/src/assets/svg/bx-copy.svg'} alt={'Copy Icon'} />
          Copy Private Key
        </Button>
      </div>

      <div className={clsx([ 'flex justify-center'])}>
        <Button variant={'neutral'} size={'btnWithBgImg'}>Logout</Button>
      </div>

    </div>
  )
}
