import { Button } from '../base/button'

/* Component props / requirements */
type Props = {
  mapHex: 'not-sure-about-the-type-of-this-yet',
  gameStats: Record<string, Array<{
    label: string,
    img: string
  }>>,
  narration: string,
  actions: Array<{
    description: string,
    action: () => void
  }>
}

export default function GridStoryLayout() {

  return (
    <div className="flex-1 grid grid-cols-2">
      {/* Map / Visuals */}
      <section className="flex flex-col">
        <img className='h-auto max-h-[600px]' src='src/assets/Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0.jpg' alt='Leonardo_Creative_beautiful_town_center_fantasy_rpg_gamelike_l_0' />
      </section>
      {/* Game status */}
      <section className="flex flex-col p-10">game status here</section>
      {/* Narrative */}
      <section className="flex flex-col gap-3 p-10">
        <p className="font-bold tracking-wide">Narrative</p>
        <p className=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.</p>
      </section>
      {/* Action container */}
      <section className="flex flex-col gap-3 p-10">
        <p className="font-bold tracking-wide">Actions</p>
        <Button>Action A</Button>
        <Button>Action B</Button>
        <Button>Action C</Button>
      </section>
    </div>
  )
}
