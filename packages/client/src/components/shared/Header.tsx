const Header = () => {
  return (
    <div className={"grid grid-cols-12 gap-10 bg-black p-3 sticky"}>
      <div className={"absolute bg-red-100 rounded-full top-1 left-1 overflow-hidden"}>
        <img src="src/assets/Leonardo_Creative_Adult_Female_Bluish_Asian_Elf_Long_white_wav_0 (1).jpg" alt="test" className={"h-[130px] w-[130px]"}/>
      </div>
      <div className={"col-span-1"}></div>
      <div className={"col-span-1 flex gap-2"}>
        <img src="src/assets/history.png" alt="test" className={"h-[60px] w-[80px]"}/>
        <span className={"self-center text-lg"}>History</span>
      </div>
      <div className={"col-span-1 flex gap-2"}>
        <img src="src/assets/settings.png" alt="test" className={"h-[60px] w-[80px]"}/>
        <span className={"self-center text-lg"}>Settings</span>
      </div>
    </div>
  )
}

export default Header
