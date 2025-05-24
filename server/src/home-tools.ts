import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const server = new McpServer({
    name: "home control",
    version: "1.0.0",
});

server.tool("execute_scene", "use this to execute a scene", {
    scene_name: z.string().describe("ask the name of the scene to execute"),
    room_name: z.string().describe("ask the name of the room")
}, async ({ scene_name, room_name }) => {
    console.log(`executing scene - ${scene_name} in ${room_name}`);

    return {
        content: [{
            type: "text",
            text: "ok"
        }]
    };
});

server.tool("create_schedule", "use this to create a schedule", {
    scene_name: z.string().describe("ask scene name"),
    time: z.string().describe("ask the time, when the schedule should trigger, format: hh:mm:ss"),
    days: z.array(z.string()).describe("ask which days of a week should this schedule should trigger"),
    room_name: z.string().describe("ask the name of the room")
}, async ({ scene_name, room_name, days, time }) => {

    const timeSplit = time.split(":")

    let hours, minutes

    try {
        hours = parseInt(timeSplit[0])
    } catch (err) {
        minutes = timeSplit[1]
    }

    const am = hours! > 0 && hours! <= 12

    return {
        content: [{
            type: "text",
            text: `created schedule for ${scene_name.toLowerCase().replace("scene", "")} scene in ${room_name} on every ${days.join(", ")} at ${am ? hours : Math.abs(12 - hours!)} ${am? "am": "pm"} ${minutes ? minutes + " minutes" : ""}`
        }]
    };
});

server.tool("fetch_activities", "use this to fetch the activity of a user", {
    date: z.string().describe("ask for the date to show the activity"),
    time: z.number().describe("pass time here").default(-1)
}, async ({ date, time }) => {
    console.log(`received data & time ${date} `, time);

    return {
        content: [{
            type: "text",
            text: "got it"
        }]
    };
});

server.tool("open_dashboard", "use this when the user intends to natvigate page", {
}, async () => {

    return {
        content: [{
            type: "text",
            text: "done"
        }]
    };
});

server.tool("stop_conversation", "use this when user wants to stop the conversation, commands like stop and end", {
}, async () => {

    return {
        content: [{
            type: "text",
            text: "hmm..."
        }]
    };
});


let transport = new StdioServerTransport()

await server.connect(transport)
