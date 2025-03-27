import { connect, JSONCodec, type NatsConnection, type Msg } from "nats.ws"

interface ConnInfo {
    host: string,
    port: number,
    token: string
}

export interface ChatResponse {
    model: string;
    created_at: Date;
    message: Message;
    done: boolean;
    done_reason: string;
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
}

export interface Message {
    role: string;
    content: string;
    images?: Uint8Array[] | string[];
    tool_calls?: any[];
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
    }

    async request(subject: string, jsonData: any): Promise<any> {
        if(!this.nc){
            throw new Error("INVALID NATS CONNECTION")
        }
        const data = nats.jc.encode(jsonData)
        const res = await this.nc.request(subject, data,  {timeout: 30 * 1000})

        return nats.jc.decode(res.data)
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

export const nats = new NatsClient({ host: "localhost", port: 4224, token: "nats-test" })
// export const nats = new NatsClient({ host: "kioti-nats-1.keus.in", port: 443, token: "keus-ops-nats" })