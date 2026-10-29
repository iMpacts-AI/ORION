import { Tool } from '../shared/types';
import { ToolRegistry as CoreToolRegistry } from '../main/services/ToolRegistry';
import { ToolSchemas, SchemaValidationOutcome } from './ToolSchemas';

/**
 * Unified Harness ToolRegistry that wraps the canonical ORION `ToolRegistry`
 * (`src/main/services/ToolRegistry.ts`) and adds the structured harness tools.
 */
export class ToolRegistry {
  public readonly coreRegistry: CoreToolRegistry;
  public readonly schemas: ToolSchemas;

  constructor(coreRegistry?: CoreToolRegistry) {
    this.coreRegistry = coreRegistry || new CoreToolRegistry();
    this.schemas = new ToolSchemas(this.coreRegistry);
  }

  public getTool(toolId: string): Tool | undefined {
    return this.schemas.getToolDefinition(toolId);
  }

  public getAllTools(): Tool[] {
    return this.schemas.getAllTools();
  }

  public validate(toolId: string, args?: Record<string, any>): SchemaValidationOutcome {
    return this.schemas.validateArguments(toolId, args);
  }
}
