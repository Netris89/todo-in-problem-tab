// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Diagnostic } from "./diagnostic";
import { } from "./parsedDiagnostic";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
    const diagnostic = new Diagnostic();

    // Parse active document
    let document = vscode.window.activeTextEditor?.document;
    if (document !== undefined)
    {
        diagnostic.updateDiagnostics(document);
    }

    // Parse document if it changed
    vscode.workspace.onDidChangeTextDocument(event =>
    {
        diagnostic.updateDiagnostics(event.document);
    }, null, context.subscriptions);

    // Parse newly opened documents
    vscode.workspace.onDidOpenTextDocument(document =>
    {
        diagnostic.updateDiagnostics(document);
    }, null, context.subscriptions);

    // Remove diagnostics of clased documents
    vscode.workspace.onDidCloseTextDocument(document =>
    {
        diagnostic.deleteDiagnostics(document);
    }, null, context.subscriptions);
}

// This method is called when your extension is deactivated
export function deactivate() { }
