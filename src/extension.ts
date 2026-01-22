// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Parse } from './parse';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
    // Create a diagnostic collection and subscribe to it
    let collection = vscode.languages.createDiagnosticCollection("diagnostics");
    context.subscriptions.push(collection);

    // Define the keywords to look for and create a new Parse instance with them. Later, get keywords from user defined settings
    let keywords = ["TODO", "FIXME"];
    const parser = new Parse(keywords);

    // Parse active document
    let document = vscode.window.activeTextEditor?.document;
    if (document !== undefined)
    {
        collection.set(document.uri, parser.parseDocument(document));
    }

    // Parse document if it changed
    vscode.workspace.onDidChangeTextDocument(event =>
    {
        collection.set(event.document.uri, parser.parseDocument(event.document));
    }, null, context.subscriptions);

    // Parse newly opened documents
    vscode.workspace.onDidOpenTextDocument(document =>
    {
        collection.set(document.uri, parser.parseDocument(document));
    }, null, context.subscriptions);

    // Remove diagnostics of clased documents
    vscode.workspace.onDidCloseTextDocument(document =>
    {
        collection.delete(document.uri);
    }, null, context.subscriptions);
}

// This method is called when your extension is deactivated
export function deactivate() { }
