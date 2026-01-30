// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Parse } from './parse';
import { build } from "./diagnostic";
import { } from "./parsedDiagnostic";
import { SourceText } from './sourceText';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
    // Create a diagnostic collection and subscribe to it
    let collection = vscode.languages.createDiagnosticCollection("diagnostics");
    context.subscriptions.push(collection);

    // Define the keywords to look for and create a new Parse instance with them. Later, get keywords from user defined settings
    let keywords = vscode.workspace.getConfiguration("todo-in-problem-tab").get<string[]>("keywords", []);
    const parser = new Parse(keywords);

    // Parse active document
    let document = vscode.window.activeTextEditor?.document;
    if (document !== undefined)
    {
        let diagnostics: vscode.Diagnostic[] = [];
        const sourceText = new SourceText(document.getText());
        const parsedDiagnostics = parser.parseDocument(sourceText);
        parsedDiagnostics.forEach(diagnostic =>
        {
            const builtDiagnostic = build(diagnostic.startLine, diagnostic.startChar, diagnostic.endLine, diagnostic.endChar, diagnostic.endChar - diagnostic.startChar, diagnostic.message);
            diagnostics.push(builtDiagnostic);
        });
        collection.set(document.uri, diagnostics);
    }

    // Parse document if it changed
    vscode.workspace.onDidChangeTextDocument(event =>
    {
        let diagnostics: vscode.Diagnostic[] = [];
        const sourceText = new SourceText(event.document.getText());
        const parsedDiagnostics = parser.parseDocument(sourceText);
        parsedDiagnostics.forEach(diagnostic =>
        {
            const builtDiagnostic = build(diagnostic.startLine, diagnostic.startChar, diagnostic.endLine, diagnostic.endChar, diagnostic.endChar - diagnostic.startChar, diagnostic.message);
            diagnostics.push(builtDiagnostic);
        });
        collection.set(event.document.uri, diagnostics);
    }, null, context.subscriptions);

    // Parse newly opened documents
    vscode.workspace.onDidOpenTextDocument(document =>
    {
        let diagnostics: vscode.Diagnostic[] = [];
        const sourceText = new SourceText(document.getText());
        const parsedDiagnostics = parser.parseDocument(sourceText);
        parsedDiagnostics.forEach(diagnostic =>
        {
            const builtDiagnostic = build(diagnostic.startLine, diagnostic.startChar, diagnostic.endLine, diagnostic.endChar, diagnostic.endChar - diagnostic.startChar, diagnostic.message);
            diagnostics.push(builtDiagnostic);
        });
        collection.set(document.uri, diagnostics);
    }, null, context.subscriptions);

    // Remove diagnostics of clased documents
    vscode.workspace.onDidCloseTextDocument(document =>
    {
        collection.delete(document.uri);
    }, null, context.subscriptions);
}

// This method is called when your extension is deactivated
export function deactivate() { }
