import { loadJson, storeJson } from './index'
import { Log, LogHistoryProps } from 'types'

type History = {
  logs: Log[]
}

const logHistory = async ({ hash, log }: LogHistoryProps) => {
  const history = await loadJson<History>(hash, { logs: []})
  history.logs.push(log)
  return storeJson(history)
}

export default logHistory
