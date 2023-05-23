import { createContext, ReactNode, useContext } from "react";
import { SetupResult } from "./mud/setup";
import { useAtom } from 'jotai'
import { triggerRender_atom } from './atoms/globalAtoms'

const MUDContext = createContext<SetupResult | null>(null);

type Props = {
  children: ReactNode;
  value: SetupResult;
};

export const MUDProvider = ({ children, value }: Props) => {
  const [t, setT] = useAtom(triggerRender_atom)

  const currentValue = useContext(MUDContext);
  if (currentValue) throw new Error("MUDProvider can only be used once");
  return <MUDContext.Provider key={t} value={value}>{children}</MUDContext.Provider>;
};

export const useMUD = () => {
  const value = useContext(MUDContext);
  if (!value) throw new Error("Must be used within a MUDProvider");
  return value;
};
