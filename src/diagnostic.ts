import * as vscode from 'vscode';

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
export function build(startLine: number, startChar: number, endLine: number, endChar: number, lineLength: number, text: string): vscode.Diagnostic
{
    const range = new vscode.Range(startLine, startChar, endLine, endChar);
    const diagnostic = new vscode.Diagnostic(range, text, vscode.DiagnosticSeverity.Information);

    return diagnostic;
}
