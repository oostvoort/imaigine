import { clsx } from 'clsx'
import { Button } from '@/components/base/Button'
import useLocalStorage from '@/hooks/useLocalStorage'

const DUMMY_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
export default function Settings() {
  const [privateKey, setPrivateKey] = useLocalStorage('mud:burnerWallet', DUMMY_PRIVATE_KEY)
  return (
    <div className={clsx([ 'md:w-[622px]  h-full w-full', 'p-sm' ])}>
      <h3 className={clsx([ 'text-accent text-jost', 'uppercase tracking-[1.4px] font-medium', 'mb-sm' ])}>History</h3>

      <div
        className={clsx([ 'flex items-center justify-between', 'w-full', 'text-option-11 text-xl', 'leading-8 tracking-[0.4px] font-segoe' ])}>
        <p>Private Key: Alice</p>
        <p className={'truncate'}>{privateKey}</p>
      </div>

      <div className={clsx([ 'my-lg', 'flex justify-center'])}>
        <Button
          className={clsx(['flex items-center justify-center gap-2', 'bg-transparent', 'text-option-8 text-xl', 'leading-8 font-segoe font-semibold', 'hover:bg-transparent'     ])}
          onClick={() => navigator.clipboard.writeText(privateKey)}
        >
          <img src={'/src/assets/svg/bx-copy.svg'} alt={'Copy Icon'} />
          Copy Private Key
        </Button>
      </div>

      <div className={clsx([ 'flex justify-center'])}>
        <Button
          variant={'neutral'}
          size={'btnWithBgImg'}
          onClick={() => {
            setPrivateKey('')
            window.location.reload()
          }}>Logout</Button>
      </div>

    </div>
  )
}
