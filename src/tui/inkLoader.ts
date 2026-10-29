import React from 'react';

export interface InkPrimitives {
  Box: React.ComponentType<any>;
  Text: React.ComponentType<any>;
  Newline: React.ComponentType<any>;
  Spacer: React.ComponentType<any>;
  Static: React.ComponentType<any>;
  render: (tree: React.ReactElement, options?: any) => {
    rerender: (tree: React.ReactElement) => void;
    unmount: (error?: Error | number | null) => void;
    waitUntilExit: () => Promise<void>;
    clear: () => void;
    cleanup: () => void;
  };
  useInput: (handler: (input: string, key: any) => void, options?: { isActive?: boolean }) => void;
  useApp: () => { exit: (error?: Error) => void };
  useStdout: () => { stdout: NodeJS.WriteStream; write: (data: string) => void };
  useStdin: () => { stdin: NodeJS.ReadStream; isRawModeSupported: boolean; setRawMode: (val: boolean) => void };
  TextInput: React.ComponentType<{
    value: string;
    onChange: (val: string) => void;
    onSubmit?: (val: string) => void;
    placeholder?: string;
    focus?: boolean;
    mask?: string;
    showCursor?: boolean;
    highlightPastedText?: boolean;
  }>;
}

let cachedPrimitives: InkPrimitives | null = null;

/**
 * Dynamically imports `ink@5` and `ink-text-input@6` using native ESM `import()`
 * so CommonJS runtime transpilation (`ts.transpileModule`) never triggers `ERR_REQUIRE_ASYNC_MODULE`.
 */
export async function loadInkPrimitives(): Promise<InkPrimitives> {
  if (cachedPrimitives) {
    return cachedPrimitives;
  }

  const nativeImport = new Function('specifier', 'return import(specifier)') as (
    specifier: string
  ) => Promise<any>;

  const [inkMod, textInputMod] = await Promise.all([
    nativeImport('ink'),
    nativeImport('ink-text-input')
  ]);

  const TextInputComp = textInputMod.default || textInputMod.UncontrolledTextInput || textInputMod;

  cachedPrimitives = {
    Box: inkMod.Box,
    Text: inkMod.Text,
    Newline: inkMod.Newline,
    Spacer: inkMod.Spacer,
    Static: inkMod.Static,
    render: inkMod.render,
    useInput: inkMod.useInput,
    useApp: inkMod.useApp,
    useStdout: inkMod.useStdout,
    useStdin: inkMod.useStdin,
    TextInput: TextInputComp
  };

  return cachedPrimitives;
}
