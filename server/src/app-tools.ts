import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const server = new McpServer({
    name: "match finder",
    version: "1.0.0",
});

server.tool("found_matching", "call this if you find a exact intent is in the input list", {
    match: z.string().describe("pass the matching string")
}, async ({ match }) => {

    return {
        content: [{
            type: "text",
            text: `${match}`
        }]
    };
});

server.tool("not_found_matching", "use this to tell if there is not matching", {
}, async () => {

    return {
        content: [{
            type: "text",
            text: `sorry, not found any thing`
        }]
    };
});


let transport = new StdioServerTransport()

await server.connect(transport)
