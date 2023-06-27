import { clsx } from 'clsx'

export default function History() {
  return (
    <div className={clsx([ 'md:w-[872px] md:h-[684px] h-full w-full', 'p-sm' ])}>
      <h3 className={clsx(['text-accent text-jost', 'uppercase tracking-[1.4px] font-medium', 'mb-md'])}>History</h3>

      <div className={clsx([ 'h-[590px] w-full', 'overflow-y-auto' ])}>
        <p className={clsx(['text-option-11 text-left text-xl', 'tracking-[0.4px] leading-8', 'font-segoe'])}>
          Alice felt the life drain out of her body as she took her final breath. Darkness engulfed her, and she felt as
          though she were falling into a bottomless pit. Suddenly, she felt a jolt, and her eyes snapped open. She found
          herself in a new world, surrounded by strange, fantastical creatures. She looked down at herself, surprised to
          see that she had been reincarnated as an elf with long, white wavy hair and almond-shaped red eyes. A voice
          spoke to her, promising her a new life filled with adventure and magic. Alice smiled, ready to embrace this
          new world and all its wonders. *Summary of what happened*, Elysia gave pointed a nearby treasure, and
          mentioned that Alyssa could have some clues that could help in your quest.

          Alice weary footsteps echoed on the cobblestone streets as she entered the enchanting town of Lindwurm. The
          scent of blooming flowers filled the air, and the cheerful chatter of locals wafted through the bustling
          market square. Vibrant cottages with thatched roofs lined the winding streets, inviting her to explore
          further. The tranquil river flowed gracefully, reflecting the golden rays of the setting sun. Intrigued, Alice
          embraced the warmth of Lindwurm's welcoming atmosphere, her eyes sparkling with anticipation. This picturesque
          haven held the promise of new encounters, captivating stories, and a sense of belonging she had long yearned
          for.

          Alice stepped into the blacksmith shop, greeted by the rhythmic clanging of hammers on metal. The air was
          thick with the scent of heated iron. Rows of gleaming weapons adorned the walls. The blacksmith, muscles
          glistening with sweat, looked up and nodded, ready to forge new adventures.
        </p>
      </div>
    </div>
  )
}
