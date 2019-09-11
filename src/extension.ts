/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from "path";
import { workspace, ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions
} from "vscode-languageclient";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

  // The server is implemented in node
  let relativePath = path.join(
    "node_modules",
    "javascript-typescript-langserver",
    "lib",
    "language-server-stdio.js"
  );

  let serverModule = context.asAbsolutePath(relativePath);

  let serverOptions: ServerOptions = {
    run: {
      command: serverModule,
      args: ["-t", "-l", "./LOGFILE.log"]
    },
    debug: {
      command: "node",
      args: [
        "--nolazy",
        "--inspect=6009",
        serverModule,
        "-t",
        "-l",
        "./LOGFILE.log"
      ]
    }
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "javascript" }],
    // documentSelector: [{ scheme: "file", language: "typescript" }],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      //fileEvents: workspace.createFileSystemWatcher("**/.clientrc")
    }
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "IViewsLanguageSever",
    "Language Server for Iviews",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
