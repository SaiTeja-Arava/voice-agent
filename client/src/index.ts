import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline/promises"
import { ChatResponse, Message, Ollama, Tool } from "ollama";
import { nats } from "./nats.js";
import { Msg } from "nats";

const transport = new StdioClientTransport({
  command: "node",
  args: ["/app/server/build/index.js"]
});

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0"
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {}
    }
  }
);

console.log("created client")

await client.connect(transport);

const availableTools = await client.listTools()

const tools = availableTools.tools.map(tool => <Tool>{
  type: "function",
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema
  }
})

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const ollama = new Ollama({ host: "http://ollama:11434" })

function chatWithOllama(messages: Message[]): Promise<ChatResponse> {

  return ollama.chat({
    model: "qwen2.5:7b",
    messages: [
      {
        role: "system",
        content: "verify and translate the context to english if you detect any other language"
      },
      ...messages
    ],
    stream: false,
    tools: tools
  })
}

async function startTerminalInterface() {
  const prompt = await r1.question(">>")

  const res = await chatWithOllama([{
    role: "user",
    content: prompt,

  }])

  console.log("ollama res : ", res.message.content)

  if (res.message.tool_calls) {
    console.log("tool call", res.message.tool_calls)
  }

  setImmediate(startTerminalInterface)
}

async function startNatsInterface() {
  await nats.start()
  const handler = async (msg: Msg) => {
    const data = <Message[]>nats.jc.decode(msg.data)
    const res = await chatWithOllama(data)
    if (!res.message.tool_calls) {
      msg.respond(nats.jc.encode(res))
      return
    }

    const toolCall = res.message.tool_calls[0]

    const tollRes = await client.callTool(toolCall.function)

    console.log("tool res-", toolCall)

    //@ts-ignore
    res.message.content = <string>tollRes.content[0]?.text

    msg.respond(nats.jc.encode(res))

  }

  nats.subscribe("handle-text", handler)
}

// startTerminalInterface()
startNatsInterface()