import { connect, JSONCodec, type NatsConnection, type Msg } from "nats"
import { DetailedInfo } from "./interfaces/index.js"

interface ConnInfo {
    host: string,
    port: number,
    token: string
}

class NatsClient {
    nc: NatsConnection | null = null
    connInfo: ConnInfo
    jc = JSONCodec()

    constructor(conf: ConnInfo) {
        this.connInfo = conf
    }

    async start() {
        this.nc = await connect({
            servers: [`nats://${this.connInfo.host}:${this.connInfo.port}`],
            token: this.connInfo.token
        })

        console.log("connected to server -", this.nc.getServer())
    }

    private async systemManagerCall(siteId: string, data: any) {

        if (!this.nc) {
            throw new Error("INVALID CONNECTION")
        }

        const res = await this.nc.request(`${siteId}-ops-sm`, this.jc.encode(data), { timeout: 2 * 60 * 1000 })

        return this.jc.decode(res.data)
    }

    async getDetailedInfo(siteId: string) {
        const res: any = await this.systemManagerCall(siteId, {
            name: "DETAILED_INFO"
        })

        return <DetailedInfo>res?.data
    }

    async subscribe(subject: string, callback: (msg: Msg) => Promise<any> | any) {
        const sub = this.nc?.subscribe(subject)

        if (!sub) {
            throw new Error("INVALID CLIENT")
        }

        const handler = async () => {
            for await (const msg of sub) {
                const res = await callback(msg)

                msg.respond(res)
            }
        }

        handler()

        return sub
    }

}

export const nats = new NatsClient({ host: "localhost", port: 4222, token: "nats-test" })

export const cloudNats = new NatsClient({
    host: "kioti-nats-1.keus.in",
    port: 6969,
    token: "keus-ops-nats",
})