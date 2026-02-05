// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { DiagnosticManager } from "./diagnostic";
import { } from "./parsedDiagnostic";
import { Parse } from './parse';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
    const collection = vscode.languages.createDiagnosticCollection("diagnostics");
    let keywords = vscode.workspace.getConfiguration("todo-in-problem-tab").get<string[]>("keywords", []);
    let parser = new Parse(keywords);
    let manager = new DiagnosticManager(parser, collection);

    // Parse active document
    let document = vscode.window.activeTextEditor?.document;
    if (document !== undefined)
    {
        manager.updateDiagnostics(document);
    }

    // Parse document if it changed
    vscode.workspace.onDidChangeTextDocument(event =>
    {
        manager.updateDiagnostics(event.document);
    }, null, context.subscriptions);

    // Parse newly opened documents
    vscode.workspace.onDidOpenTextDocument(document =>
    {
        manager.updateDiagnostics(document);
    }, null, context.subscriptions);

    // Parse files again after changes in the keywords
    vscode.workspace.onDidChangeConfiguration(event =>
    {
        if (event.affectsConfiguration("todo-in-problem-tab.keywords"))
        {
            collection.clear();
            keywords = vscode.workspace.getConfiguration("todo-in-problem-tab").get<string[]>("keywords", []);
            parser = new Parse(keywords);
            manager = new DiagnosticManager(parser, collection);

            for (const document of vscode.workspace.textDocuments)
            {
                manager.updateDiagnostics(document);
            }
        }
    }, null, context.subscriptions);

    // Remove diagnostics of clased documents
    vscode.workspace.onDidCloseTextDocument(document =>
    {
        manager.deleteDiagnostics(document);
    }, null, context.subscriptions);
}

// This method is called when your extension is deactivated
export function deactivate()
{ }
