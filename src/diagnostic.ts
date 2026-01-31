import * as vscode from 'vscode';
import { SourceText } from './sourceText';
import { Parse } from './parse';

/**
 * Manages parsing and reporting of diagnostics for VS Code text documents.
 *
 * This class encapsulates a diagnostic collection, a parser configured
 * with user-defined keywords, and provides methods to update or clear
 * diagnostics for documents.
 */
export class Diagnostic
{
    private collection: vscode.DiagnosticCollection;
    private keywords: string[];
    private parser: Parse;

    /**
     * Initializes a new instance of the `Diagnostic` class.
     * 
     * Creates a VS Code diagnostic collection, reads user-defined keywords,
     * and initializes the parser for processing documents.
     */
    constructor()
    {
        this.collection = vscode.languages.createDiagnosticCollection("diagnostics");
        this.keywords = vscode.workspace.getConfiguration("todo-in-problem-tab").get<string[]>("keywords", []);
        this.parser = new Parse(this.keywords);
    }

    /**
     * Builds a VS Code Diagnostic for a given range in a text document.
     *
     * @param startLine Zero-based start line of the diagnostic.
     * @param startChar Zero-based start character of the diagnostic.
     * @param endLine Zero-based end line of the diagnostic.
     * @param lineLength Length of the line or range to cover from startChar.
     * @param text Message to display in the diagnostic.
     * @returns A `vscode.Diagnostic` representing the given range and message,
     *          with severity set to Information.
     *
     * @remarks
     * The end character is calculated as `startChar + lineLength`.
     * This function is meant to convert a parsed diagnostic position
     * into a VS Code diagnostic object.
     */
    public build(startLine: number, startChar: number, endLine: number, endChar: number, lineLength: number, text: string): vscode.Diagnostic
    {
        const range = new vscode.Range(startLine, startChar, endLine, endChar);
        const diagnostic = new vscode.Diagnostic(range, text, vscode.DiagnosticSeverity.Information);

        return diagnostic;
    }

    /**
     * Updates the diagnostics for a given text document.
     *
     * Parses the document using the configured parser, converts the
     * parsed diagnostics into VS Code `Diagnostic` objects, and updates
     * the internal diagnostic collection for the document's URI.
     *
     * @param document The VS Code text document to analyze and update diagnostics for.
     */
    public updateDiagnostics(document: vscode.TextDocument)
    {
        let diagnostics: vscode.Diagnostic[] = [];
        const sourceText = new SourceText(document.getText());
        const parsedDiagnostics = this.parser.parseDocument(sourceText);

        parsedDiagnostics.forEach(diagnostic =>
        {
            const builtDiagnostic = this.build(diagnostic.startLine, diagnostic.startChar, diagnostic.endLine, diagnostic.endChar, diagnostic.endChar - diagnostic.startChar, diagnostic.message);
            diagnostics.push(builtDiagnostic);
        });

        this.collection.set(document.uri, diagnostics);
    }

    /**
     * Removes all diagnostics associated with the given text document.
     *
     * @param document The VS Code text document whose diagnostics should be cleared from the collection.
     */
    public deleteDiagnostics(document: vscode.TextDocument)
    {
        this.collection.delete(document.uri);
    }
}
