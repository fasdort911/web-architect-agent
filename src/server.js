import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { TOOL_DEFINITIONS } from './tools/definitions.js';
import { handleTool } from './tools/handlers.js';
import { VERSION } from './data/principles.js';

export async function startServer() {
  const server = new Server(
    { name: 'web-architect-2026', version: VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return handleTool(name, args);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
