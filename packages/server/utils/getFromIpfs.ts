import * as process from "process";

export async function getFromIpfs(ipfsHash: string) {
    try {
        const result = await fetch(`${process.env.IPFS_URL_PREFIX}/${ipfsHash}`)
        return result.json()
    } catch (e) {
        console.info(e)
        return e
    }
}
