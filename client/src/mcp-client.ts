import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ChatResponse, Message, Ollama, Tool, ToolCall } from "ollama";
import { ChromaClient, Collection } from "chromadb"
import fs from "fs/promises"

export class McpClient {
    client: Client;
    llm: Ollama;
    chromaClient: ChromaClient
    mainCollection?: Collection
    mainCollectionName = "main"
    patternsCollectionName = "patterns"
    patternsCollection?: Collection
    llmName: string;
    systemMessages: Message[];
    tools?: Tool[];
    transporters: string[]

    constructor(systemMessages: Message[], llmName: string, transporters: string[]) {
        this.transporters = transporters
        this.llmName = llmName
        this.client = new Client(
            { name: "llm-client", version: "1.0.0" },
            { capabilities: { prompts: {}, resources: {}, tools: {} } }
        );
        this.chromaClient = new ChromaClient()

        this.llm = new Ollama({ host: "http://localhost:11434" });
        this.systemMessages = systemMessages;
    }

    async createEmbeddings(data: any | Array<any>, model = 'nomic-embed-text') {

        const getString = (d: any) => {
            if (typeof d == "string") {
                return d
            }

            // return JSON.stringify(d, null, 4)
            return JSON.stringify(d)
        }

        const input = Array.isArray(data) ? data.map(d => getString(d)) : data.toString()


        const embeddings = await this.llm.embed({
            model,
            input
        })

        return embeddings.embeddings
    }

    async insertEmbeddings(embeddings: number[][], documents: { data: string, meta: Record<string, any> }[], ids: string | string[]) {


        await this.mainCollection?.upsert({
            embeddings: embeddings,
            ids: Array.isArray(ids) ? ids : [ids],
            //@ts-ignore
            documents: Array.isArray(documents) ? documents.map(d => d.data) : [documents.data],
            //@ts-ignore
            metadatas: Array.isArray(documents) ? documents.map(d => d.meta) : [documents.meta]
        })

    }

    async query(prompt: string) {

        const embeddings = await this.createEmbeddings(prompt)

        const result = await this.mainCollection?.query({
            queryEmbeddings: embeddings,
            nResults: 1000,
            whereDocument: {
                $or: prompt.split(' ').map(t => { return { $contains: t } })
            }
        })

        return result
    }

    async init() {
        const transport = new StdioClientTransport({
            command: "node",
            args: [...this.transporters]
        });
        await this.client.connect(transport);
        this.mainCollection = await this.chromaClient.getOrCreateCollection({
            name: this.mainCollectionName
        })
        this.patternsCollection = await this.chromaClient.getOrCreateCollection({
            name: this.patternsCollectionName
        })
        const availableTools = await this.client.listTools();
        this.tools = availableTools.tools.map(tool => (<Tool>{
            type: "function",
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema
            }
        }));
        // console.log(this.tools)
    }

    async chat(messages: Message[]): Promise<ChatResponse> {
        const _messages: Message[] = [...this.systemMessages, ...messages];
        const response = await this.llm.chat({
            // model: "qwen3:8b",
            // model: "qwen2.5:7b-instruct",
            model: this.llmName || "qwen2.5:7b",
            messages: _messages,
            stream: false,
            tools: this.tools
        });

        // If tool calls are present, execute them and append results

        // await fs.writeFile('msgs.json', JSON.stringify({ messages: _messages, tools: this.tools }, null, 4))

        return response;
    }

    async callTools(calls: ToolCall[]): Promise<string[]> {
        const results: string[] = [];
        for (const call of calls) {
            try {
                const toolRes: any = await this.client.callTool(call.function);
                results.push(toolRes.content[0]?.text || "Tool executed");
            } catch (error: any) {
                results.push(`Error calling tool ${call.function.name}: ${error.message}`);
            }
        }
        return results;
    }
}