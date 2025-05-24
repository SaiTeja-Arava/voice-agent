import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { cloudNats, nats } from "./nats.js";

const siteId = "Keus-199786d6-cf1f-47a7-87d9-af7f2a3ab9b0"

const server = new McpServer({
    name: "device DB",
    version: "1.0.0",
});

// server.tool("get_device", "if you want any device related information use this to get the device", {
//     device_name: z.string().describe("Name of the device"),
//     room_name: z.string().describe("Room name of the device in which the device is present").optional()
// }, async ({ device_name, room_name }) => {
//     console.log(`getting device ${device_name} `, room_name);
//     let device = {}
//     return {
//         content: [{
//             type: "text",
//             text: `system : device '${JSON.stringify(device, null, 4)}' ${room_name ? "from room :" : ""}${room_name}`
//         }]
//     };
// });

server.tool("create_scene_variation", "Creates a scene by setting multiple device states to match a mood (e.g., 'party vibe'). Use this tool alone for scenes. pass valid field names", {
    devices: z.array(
        z.object({
            id: z.string().describe('pass the id of the device here (device_id)'),
            name: z.string().describe('pass the name of the device here (device_name)'),
            onOffState: z.boolean().describe('send the on/off state of the device..., true for on, false for off'),
            brightness: z.optional(z.number().describe('pass the brightness of the device...')),
            // pattern: z.object({
            //     patternName: z.string().describe("name of the pattern"),
            //     properties: z.array(z.object({
            //         patternProperty: z.string().describe("pass the property name here"),
            //         patternPropertyValue: z.number().describe("pass the value to be set to this property")
            //     }).describe('this is the object of pattern properties')),
            //     colours: z.array(z.object({
            //         redPercent: z.number().describe("value of red from 0 -  255"),
            //         greenPercent: z.number().describe("value of green from 0 -  255"),
            //         bluePercent: z.number().describe("value of blue from 0 -  255")
            //     })).describe("send colours based on lights, some lights supports only one colour"),
            //     wwa: z.object({
            //         warmWhitePercent: z.number().describe("send the percentage of warm white to be set on the led, from 0 - 100"),
            //         coolWhitePercent: z.number().describe("send the percentage of cool white to be set on the led, from 0 - 100"),
            //         amberPercent: z.number().describe("send the percentage of amber colour to be set on the led, from 0 - 100"),
            //     }).describe('pass the warm white settings in this object').optional()
            // }).optional()
        }).describe('this state will be showed to user...')
    ).describe('pass the list of devices with suitable states...'),
    room_name: z.string().describe("pass room name here"),
    room_area: z.string().optional().describe("pass the name of area of the room if available, include all the lights in the room if no area is specified")
}, async ({ room_name, devices, room_area }) => {
    console.log(`Creating scene in ${room_name} with devices:`, devices);

    // Simulate device state validation and application
    const feedback = devices.map(device => {
        return `${device.name} set to ${device.onOffState || "unchanged"}` +
            (device.brightness ? `, brightness ${device.brightness}%` : "")
    });

    return {
        content: [{
            type: "text",
            text: `Scene created in ${room_name}: ${feedback.join("; ")}, did you like this, please let me know if you need to change any thing.`
        }]
    };
});

server.tool("save_scene", "Saves a scene with the current device states", {
    scene_name: z.string().describe("Name of the scene to save"),
    devices: z.array(z.object({
        name: z.string(),
        onOffState: z.boolean(),
        brightness: z.optional(z.number()),
        // pattern: z.object({
        //     patternName: z.string().describe("name of the pattern"),
        //     properties: z.array(z.object({
        //         patternProperty: z.string().describe("pass the property name here"),
        //         patternPropertyValue: z.number().describe("pass the value to be set to this property")
        //     }).describe('this is the object of pattern properties')),
        //     colours: z.array(z.object({
        //         redPercent: z.number().describe("value of red from 0 -  255"),
        //         greenPercent: z.number().describe("value of green from 0 -  255"),
        //         bluePercent: z.number().describe("value of blue from 0 -  255")
        //     })).describe("send colours based on lights, some lights supports only one colour"),
        //     wwa: z.object({
        //         warmWhitePercent: z.number().describe("send the percentage of warm white to be set on the led, from 0 - 100"),
        //         coolWhitePercent: z.number().describe("send the percentage of cool white to be set on the led, from 0 - 100"),
        //         amberPercent: z.number().describe("send the percentage of amber colour to be set on the led, from 0 - 100"),
        //     }).describe('pass the warm white settings in this object').optional()
        // }).optional()
    })),
    room_name: z.string()
}, async ({ scene_name, devices, room_name }) => {
    console.log(`Saving scene '${scene_name}' in ${room_name} with devices:`, devices);
    return {
        content: [{
            type: "text",
            text: `Scene '${scene_name}' saved successfully in ${room_name}`
        }]
    };
});

server.tool('control_device', 'use this tool to control a single device, or to change the state of a single device', {
    device_id: z.string().describe('pass the id of the device here'),
    device_name: z.string().describe('pass the name of the device here'),
    onOffState: z.boolean().describe('send the on/off state of the device..., true for on, false for off'),
    brightness: z.optional(z.number().describe('pass the brightness of the device...')),
    room_name: z.string().describe("name of the room")
    // pattern: z.object({
    //     patternName: z.string().describe("name of the pattern"),
    //     properties: z.array(z.object({
    //         patternProperty: z.string().describe("pass the property name here"),
    //         patternPropertyValue: z.number().describe("pass the value to be set to this property")
    //     }).describe('this is the object of pattern properties')),
    //     colours: z.array(z.object({
    //         redPercent: z.number().describe("value of red from 0 -  255"),
    //         greenPercent: z.number().describe("value of green from 0 -  255"),
    //         bluePercent: z.number().describe("value of blue from 0 -  255")
    //     })).describe("send colours based on lights, some lights supports only one colour"),
    //     wwa: z.object({
    //         warmWhitePercent: z.number().describe("send the percentage of warm white to be set on the led, from 0 - 100"),
    //         coolWhitePercent: z.number().describe("send the percentage of cool white to be set on the led, from 0 - 100"),
    //         amberPercent: z.number().describe("send the percentage of amber colour to be set on the led, from 0 - 100"),
    //     }).describe('pass the warm white settings in this object').optional()
    // }).optional()
}, async ({
    device_id,
    device_name,
    onOffState,
    brightness
}) => {
    console.log(`Controlling device ${device_name} with id ${device_id} to ${onOffState} ${brightness ? `, brightness ${brightness}%` : ""}`)
    return {
        content: [{
            type: "text",
            text: `Device ${device_name} set to ${onOffState} ${brightness ? `, brightness ${brightness}%` : ""}`
        }]
    }
})

server.tool('execute_scene', 'use this tool to execute or apply a preconfigured scene in a room', {
    scene_name: z.string().describe("pass the name of the scene here"),
    room_name: z.string().describe("pass the name of the room here"),
    scene_id: z.string().describe('pass id of the scene here')
    // pattern: z.object({
    //     patternName: z.string().describe("name of the pattern"),
    //     properties: z.array(z.object({
    //         patternProperty: z.string().describe("pass the property name here"),
    //         patternPropertyValue: z.number().describe("pass the value to be set to this property")
    //     }).describe('this is the object of pattern properties')),
    //     colours: z.array(z.object({
    //         redPercent: z.number().describe("value of red from 0 -  255"),
    //         greenPercent: z.number().describe("value of green from 0 -  255"),
    //         bluePercent: z.number().describe("value of blue from 0 -  255")
    //     })).describe("send colours based on lights, some lights supports only one colour"),
    //     wwa: z.object({
    //         warmWhitePercent: z.number().describe("send the percentage of warm white to be set on the led, from 0 - 100"),
    //         coolWhitePercent: z.number().describe("send the percentage of cool white to be set on the led, from 0 - 100"),
    //         amberPercent: z.number().describe("send the percentage of amber colour to be set on the led, from 0 - 100"),
    //     }).describe('pass the warm white settings in this object').optional()
    // }).optional()
}, async ({
    scene_name,
    room_name
}) => {
    console.log(`Applying scene ${scene_name} in ${room_name}`)
    return {
        content: [{
            type: "text",
            text: `Scene ${scene_name} applied on ${room_name}`
        }]
    }
})

let transport = new StdioServerTransport()

await nats.start()
// await cloudNats.start()

await server.connect(transport)
