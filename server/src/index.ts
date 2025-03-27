import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { cloudNats, nats } from "./nats.js";

const siteId = "Keus-199786d6-cf1f-47a7-87d9-af7f2a3ab9b0"

const server = new McpServer({
    name: "Home automation",
    version: "1.0.0",
});

server.tool("turn_off_everything_in_room", "This tool can be used to turn off all the devices in the room", {
    room_name: z.string().describe("pass room name here")
}, async ({ room_name }) => {

    console.log("turning off everything in this room", room_name)

    return {
        content: [
            {
                type: "text",
                text: "device turned on"
            }
        ]
    }

})

server.tool("turn_on_everything_in_room", "This tool can be used to turn on all the devices in the room", {
    room_name: z.string().describe("pass room name here")
}, async ({ room_name }) => {

    console.log("turning on everything in this room", room_name)

    return {
        content: [
            {
                type: "text",
                text: "device turned on"
            }
        ]
    }

})

server.tool("turn_on_device", "This tool can be used to turn on the device, pass the required parameters in the call", {
    device_name: z.string().describe("pass device name here"),
    room_name: z.string().describe("pass room name here")
}, async ({ device_name, room_name }) => {

    console.log("These are device parameters for turn on", device_name, room_name)

    const deviceName = device_name.replace(/[^a-zA-Z0-9_]/g, '')
    const roomName = room_name.replace(/[^a-zA-Z0-9_]/g, '')

    console.log(deviceName, roomName)

    if (!deviceName.includes("tubelight") || !roomName.includes("workstation")) {
        return {
            content: [
                {
                    type: "text",
                    text: "I cannot turn on this device"
                }
            ]
        }
    }

    await cloudNats.request(`${siteId}-HUB-REQ-MANAGER-JSON-RPC`, {
        rpc_name: "UpdateEmbeddedSwitchApplianceState",
        rpc_data: {
            deviceId: "0x00124b0026c3ce4d",
            applianceId: "LhojGG",
            onOffState: {
                switchState: 255
            }
        }
    })

    return {
        content: [
            {
                type: "text",
                text: "device turned on successfully"
            }
        ]
    }
})

server.tool("turn_off_device", "This tool can be used to turn off the device, pass the required parameters in the call", {
    device_name: z.string().describe("pass device name here"),
    room_name: z.string().describe("pass room name here")
}, async ({ device_name, room_name }) => {

    console.log("These are device parameters for turn off", device_name, room_name)

    const deviceName = device_name.replace(/[^a-zA-Z0-9_]/g, '')
    const roomName = room_name.replace(/[^a-zA-Z0-9_]/g, '')

    if (!deviceName.includes("tubelight") || !roomName.includes("workstation")) {
        return {
            content: [
                {
                    type: "text",
                    text: "I cannot turn off this device"
                }
            ]
        }
    }

    await cloudNats.request(`${siteId}-HUB-REQ-MANAGER-JSON-RPC`, {
        rpc_name: "UpdateEmbeddedSwitchApplianceState",
        rpc_data: {
            deviceId: "0x00124b0026c3ce4d",
            applianceId: "LhojGG",
            onOffState: {
                switchState: 0
            }
        }
    })

    return {
        content: [
            {
                type: "text",
                text: "device turned off successfully"
            }
        ]
    }
})

let transport = new StdioServerTransport()

await nats.start()
await cloudNats.start()

await server.connect(transport)
