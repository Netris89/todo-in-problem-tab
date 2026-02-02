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
export class DiagnosticManager
{
    private collection: vscode.DiagnosticCollection;
    private parser: Parse;

    /**
     * Initializes a new instance of the `DiagnosticManager` class.
     * 
     * Sets up a VS Code diagnostic collection and a parser for processing documents.
     * The parser should already be configured with any relevant keywords.
     *
     * @param parser The parser instance used to analyze documents.
     * @param collection The VS Code diagnostic collection to store diagnostics.
     */
    constructor(parser: Parse, collection: vscode.DiagnosticCollection)
    {
        this.collection = collection;
        this.parser = parser;
    }

    /**
     * Creates a VS Code Diagnostic from an explicit document range and message.
     *
     * @param startLine Zero-based start line of the diagnostic.
     * @param startChar Zero-based start character of the diagnostic.
     * @param endLine Zero-based end line of the diagnostic.
     * @param endChar Zero-based end character of the diagnostic.
     * @param text Message to display in the diagnostic.
     * @returns A `vscode.Diagnostic` with severity set to Information.
     *
     * @remarks
     * This method assumes that all positional information (start/end line and character)
     * has already been computed by the parser. It performs no validation or adjustment
     * of the provided range.
     */
    private build(startLine: number, startChar: number, endLine: number, endChar: number, text: string): vscode.Diagnostic
    {
        const range = new vscode.Range(startLine, startChar, endLine, endChar);
        const diagnostic = new vscode.Diagnostic(range, text, vscode.DiagnosticSeverity.Information);

        return diagnostic;
    }

    /**
     * Updates the diagnostics for a given text document.
     *
     * Converts diagnostics returned by the parser into VS Code `Diagnostic` objects
     * and updates the internal diagnostic collection for the document's URI.
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
            const builtDiagnostic = this.build(diagnostic.startLine, diagnostic.startChar, diagnostic.endLine, diagnostic.endChar, diagnostic.message);
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
