import { connect, JSONCodec, type NatsConnection, type Msg } from "nats"

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

    async subscribe(subject: string, callback: (msg: Msg) => Promise<any> | any) {
        const sub = this.nc?.subscribe(subject)

        if (!sub) {
            throw new Error("INVALID SUBSCRIPTION")
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

export const nats = new NatsClient({host: "nats", port: 4222, token: "nats-test"})