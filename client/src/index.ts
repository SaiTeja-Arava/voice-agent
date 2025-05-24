import readline from "readline/promises"
import { Message } from "ollama";
import { cloudNats, nats } from "./nats.js";
import { Msg } from "nats";
import { McpClient } from "./mcp-client.js";
import { dummyData, patterns, scenes } from "./dummy-data.js";
import { timeExecution } from "./utils/execution-time.js";

// const siteId = "Keus-199786d6-cf1f-47a7-87d9-af7f2a3ab9b0"
const siteId = "Keus-2dd029d5-e025-4c20-8eed-003a37771595"

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function appendRelatedEmbeddings(mcp: McpClient, prompt: string): Promise<Message[]> {

  const queryResult = await mcp.query(prompt)

  let _msgs: Message[] = []

  if (queryResult && queryResult.documents.length > 0) {

    const validDocs = queryResult.documents[0]
    // const validDocs = queryResult.documents[0].filter((doc, ind) => {
    //   if (!queryResult.distances) {
    //     return true
    //   }
    //   return queryResult.distances[0][ind] < 1
    // })

    const context = validDocs.join('\n\n')

    // queryResult.documents[0].map((d, ind) => {
    //   if (!queryResult.distances) {
    //     return
    //   }
    //   console.log(d, queryResult.distances[0][ind])
    // })

    // console.log("length of documents", validDocs.length)
    const content = `Use this information: ${context}`

    // console.log(queryResult)
    if (validDocs.length > 0) {
      mcp.systemMessages = [{
        role: 'system',
        // content: content + `\n patters information${JSON.stringify(patterns)}`
        content: content + `\n Scenes information: ${JSON.stringify(scenes)}`
      }]
    }
  }

  _msgs.push({
    role: 'user',
    content: prompt
  })

  return _msgs
}

async function startTerminalInterface(mcpClient: McpClient, messages: Message[] = []) {
  const prompt = `${await r1.question(">> ")}`


  if (prompt == "clear") {
    console.log("clearing history...,\n")
    messages = []
    setImmediate(() => startTerminalInterface(mcpClient, messages))
    return
  }
  let _msgs = await timeExecution(async () => await appendRelatedEmbeddings(mcpClient, prompt), 'Fetching related embeddings')

  messages.push(..._msgs)

  const res = await timeExecution(async () => await mcpClient.chat(messages), 'Ollama res')

  console.log("llm res : ", res.message.content)

  if (res.message.tool_calls) {
    console.log("tool_calls: ", res.message.tool_calls)
    mcpClient.callTools(res.message.tool_calls)
  }

  messages.push(res.message)

  setImmediate(() => startTerminalInterface(mcpClient, messages))
}

async function startNatsInterface(mcpClient: McpClient) {
  await nats.start()
  const handler = async (msg: Msg) => {
    const data = <Message[]>nats.jc.decode(msg.data)
    const res = await mcpClient.chat(data)
    if (!res.message.tool_calls) {
      msg.respond(nats.jc.encode(res))
      return
    }

    if (res.message.tool_calls) {
      mcpClient.callTools(res.message.tool_calls)
    }

    //@ts-ignore
    res.message.content = <string>tollRes.content[0]?.text

    msg.respond(nats.jc.encode(res))

  }

  nats.subscribe("handle-text", handler)
}

// (async () => {
//   // await cloudNats.start()
//   // const detailedInfo = await cloudNats.getDetailedInfo(siteId)
//   // console.log("detailed info: ", detailedInfo)
//   // return
//   // for (const device of detailedInfo.devices) {
//   //   for(const applicance of device.info)
//   // }

//   const mcpClient = new McpClient([
//     {
//       role: "system",
//       content: "you are a voice agent, verify and translate the context to english if you detect any other language"
//     },
//     // {
//     //   role: "system",
//     //   content: `I know your home's rooms and devices. Here’s a summary: ${JSON.stringify(dummyData)}. Ask for specific controls or scenes, and I'll validate details.`
//     //       content: `I know your home's rooms and devices. When you want to control something:

//     // check if I know the device and room
//     // If something doesn't match, I'll suggest the right room for your device or the right device for your room
//     // talk naturally, like a person would
//     // ask questions if the provided prompt has incorrect or unknown information
//     // the question you ask should be simple to understand, and try to reduce the number of words in the question's you ask

//     // Your house has: ${JSON.stringify(dummyData)}`
//     // },
//     {
//       role: "system",
//       content: `this is the patterns data supported by led strips patterns: ${JSON.stringify(patterns, null, 4)}`
//     },
//     {
//       role: "system",
//       content: `I know your home's rooms and devices. Rooms and device names: ${JSON.stringify(dummyData, null, 4)}. Ask for specific controls or scenes, and I'll validate details.`
//     },
//     {
//       role: "system",
//       content: "Validate user input twice. For scenes, suggest device states based on mood (e.g., 'party' = bright lights, patterns). Ask simple questions if unclear."
//     }
//   ], "")
//   await mcpClient.init()
//   console.log("initialized mcp client")
//   startTerminalInterface(mcpClient)
//   // startNatsInterface(mcpClient)
// })()

async function main() {
  const mcp = new McpClient([], "qwen2.5:3b", [])

  await mcp.init()

  const generatedEmbeddings = await timeExecution(async () => await mcp.createEmbeddings(dummyData), 'Generated embeddings')

  await timeExecution(async () => await mcp.insertEmbeddings(generatedEmbeddings, dummyData.map(d => {
    return {
      data: JSON.stringify(d, null, 4),
      meta: {
        device_room: d.device_room_name,
        device_type: d.device_type,
        device_name: d.device_name,
        device_area: d.device_room_area
      }
    }
  }), dummyData.map(d => d.device_id.toString() + d.device_room_id)), 'Updating embeddings in DB')

  console.log("******************** MCP INITIALIZED ******************")
  await startTerminalInterface(mcp)
}

main()