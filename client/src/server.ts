import { Message } from "ollama";
import { McpClient } from "./mcp-client.js";
import fastify from "fastify";
import readline from "readline/promises"
import { timeExecution } from "./utils/execution-time.js";
import { scenes } from "./dummy-data.js";

const app = fastify()
const rooms = new Set(scenes.map(s => s.scene_room))
rooms.delete("Home")
const matchFinder = new McpClient([

], "qwen2.5:14b", ["/Users/saitejaarava/Documents/playground/arena/test/voice-agent/server/build/app-tools.js"])

const mcp = new McpClient([

], "qwen2.5:14b",
    [
        "/Users/saitejaarava/Documents/playground/arena/test/voice-agent/server/build/home-tools.js",
    ])

await Promise.all([mcp.init(), matchFinder.init()])

async function validateRoom(match: string) {
    return validate(Array.from(rooms), match)
}

async function validateSceneName(match: string, roomName: string) {
    const _scenes = scenes.filter(s => s.scene_room.startsWith(roomName)).map(s => s.scene_name)

    return validate(_scenes, match)
}

async function validate(input: string[], match: string) {
    matchFinder.systemMessages = [{
        role: "system",
        content: "you are a string match finding agent, so help the user to find the closest string match for his intent,"
    }
        , {
        role: "system",
        content: `available list : ${input.join(", ")}`
    }]

    // console.log("input", `available list : ${input.join(", ")}`)

    const llmRes = await matchFinder.chat([{
        role: "user",
        content: `find match for ${match}`
    }])

    if (!llmRes.message.tool_calls) {
        return ""
    }

    const tool_call = llmRes.message.tool_calls[0]

    const matching = tool_call.function.arguments?.match

    if (!matching) {
        return {
            role: 'assistant',
            content: `sorry cannot find ${match}`
        }
    } else {
        const m1 = matching.replaceAll(" ", "").toLowerCase()
        const m2 = match.replaceAll(" ", "").toLowerCase()

        if (m1 == m2) {
            return {
                role: 'assistant',
                content: `did you mean ${matching}`
            }
        }
    }
    console.log("------matchig", matching)

    return matching
}

async function chatHelper(messages: Message[]) {

    mcp.systemMessages = [
        {
            role: 'system',
            content: `you are a home automation helper agent. \n current time: ${new Date().toString()},
            dont ask any technical details to the user`
        },
        {
            role: 'system',
            content: `keep the responses and questions as simple and as short as possible, 
            don't make any assumptions, while calling tools, take proper information what ever you want from the user,
            make sure you have correct information before executing tools`
        }, 
        // {
        //     role: 'system',
        //     content: `available home information - \n scenes : ${JSON.stringify(scenes.map(s => { return { name: s.scene_name, room: s.scene_room } }), null, 4)}
        //     rooms : ${JSON.stringify(Array.from(rooms), null, 4)}`
        // }
    ]
    let llmRes = await mcp.chat(messages)


    if (llmRes.message.tool_calls) {
        const toolCall = llmRes.message.tool_calls[0]

        const findSceneMath = async (room: string) => {
            let sceneKey = inputs.filter(i => i.startsWith("scene"))[0]
            let sceneInput = <string>toolCall.function.arguments[sceneKey]

            toolCall.function.arguments[roomKey] = room

            const _scene = scenes.filter(s => s.scene_room.startsWith(room) && s.scene_name.replaceAll(" ", "") == sceneInput.replaceAll(" ", ""))[0]?.scene_name
            if (_scene) {
                console.log("(((((", _scene)
                toolCall.function.arguments[sceneKey] = _scene
            }
            else {

                const sceneWord = await validateSceneName(sceneInput, room)
                if (typeof sceneWord != "string") {
                    llmRes.message = sceneWord
                } else if (sceneWord.length > 0) {
                    toolCall.function.arguments[sceneKey] = sceneWord
                }
            }
        }
        const inputs = Object.keys(toolCall.function.arguments)

        let roomKey = inputs.filter(i => i.startsWith("room"))[0]
        let roomInput = <string>toolCall.function.arguments[roomKey]

        if (roomKey) {

            if (!roomInput.endsWith("room")) {
                roomInput += " room"
            }

            const fromMath = Array.from(rooms).filter(r => r.replaceAll(" ", "").toLowerCase() == roomInput.replaceAll(" ", "").toLowerCase())[0]

            if (fromMath) {
                await findSceneMath(fromMath)
            } else {

                const res = await validateRoom(roomInput)

                if (typeof res != "string") {
                    llmRes.message = res
                } else if (res.length > 0) {
                    await findSceneMath(res)
                }
            }

        }


    }

    if (llmRes.message.tool_calls) {
        const toolResults = await mcp.callTools(llmRes.message.tool_calls);
        llmRes.message.content += `${toolResults.join(", ")}`;
        if(llmRes.message.content.startsWith("Error")){
            llmRes.message.content = "please try again"
        }
    }

    messages.push(llmRes.message)

    return {
        messages: messages,
        llmRes
    }
}

app.post("/chat", async (req, res) => {
    try {
        const body: any = req.body
        const params = <Message[]>body.messages
        console.log("---------req--", params)

        const chatRes = await timeExecution(async () => await chatHelper(params), 'Ollama res')

        const resObj = {
            success: true,
            data: {
                messages: chatRes.messages,
                lastMessage: chatRes.llmRes.message,
                tool: chatRes.llmRes.message.tool_calls ? {
                    type: chatRes.llmRes.message.tool_calls[0].function.name,
                    params: chatRes.llmRes.message.tool_calls[0].function.arguments
                } : undefined
            }
        }

        console.log("-------------res-----", resObj)

        res.send(resObj)
    } catch (err) {
        res.send({
            success: false,
            error: err?.toString()
        })
    }
})

app.listen({
    host: "0.0.0.0",
    port: 5252
}, () => {
    console.log("started server on 5252")
})

// const r1 = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// async function startTerminalInterface(mcpClient: McpClient, messages: Message[] = []) {
//     const prompt = `${await r1.question(">> ")}`


//     if (prompt == "clear") {
//         console.log("clearing history...,\n")
//         messages = []
//         setImmediate(() => startTerminalInterface(mcpClient, messages))
//         return
//     }

//     messages.push({
//         role: "user",
//         content: prompt
//     })

//     const res = await timeExecution(async () => await chatHelper(messages), 'Ollama res')

//     // console.log("llm res : ", res.llmRes.message.content)

//     if (res.llmRes.message.tool_calls) {
//         console.log("tool_calls: ", res.llmRes.message.tool_calls)
//         mcpClient.callTools(res.llmRes.message.tool_calls)
//     }

//     // messages.push(res.llmRes.message)

//     // console.log("messages", messages)

//     setImmediate(() => startTerminalInterface(mcpClient, messages))
// }

// startTerminalInterface(mcp, [])