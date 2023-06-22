import { clsx } from 'clsx'

export default function Header(){
  return(
    <div className={clsx([
      'fixed top-0 pb-[2px]',
      'w-full h-20',
      'bg-gold-to-dark', 'opacity-80'
    ])}>
      <div className={clsx([
        'w-full h-full',
        'bg-header-gradient',
      ])}>
        {/* Inner Frame */}
        <div className={clsx([
          'absolute left-8 w-36 h-36',
          'bg-avatar-inner-frame bg-cover bg-no-repeat',
          'cursor-pointer'
        ])}>
          {/* Outer Frame */}
          <div className={clsx([
            'absolute z-50 w-36 h-36',
            'bg-avatar-outer-frame bg-cover bg-no-repeat',
          ])}>
            {/* Avatar */}
            <img
              src="src/assets/avatar/avatar1.jpg"
              alt="Profile"
              className={clsx([
                'absolute w-24',
                'z-50 inset-6 rounded-full'
              ])}
            />
          </div>
          {/* Karma Gauge */}
          <div className={clsx([
            'absolute w-36 h-36',
            'bg-avatar-karma-gauge bg-cover bg-no-repeat',
          ])}></div>
        </div>
      </div>
    </div>
  )
}
