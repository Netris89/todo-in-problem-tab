import * as vscode from 'vscode';

/**
 * Parses the given document to find commented lines.
 * For each line starting with "//", it calls parseLine to check
 * if it contains a TODO or FIXME and converts it to a Diagnostic.
 * 
 * @param document The text document to parse.
 * @returns An array of vscode.Diagnostic objects for the TODO/FIXME comments found.
 */
export function parseDocument(document: vscode.TextDocument): vscode.Diagnostic[]
{
    let diagnostics: vscode.Diagnostic[] = [];

    for (let line = 0; line < document.lineCount; line++)
    {
        const readLine = document.lineAt(line).text;

        if (readLine.startsWith("//"))
        {
            const range = new vscode.Range(line, 0, line, readLine.length);
            const diagnostic = new vscode.Diagnostic(range, parseLine(readLine), vscode.DiagnosticSeverity.Information);
            diagnostics.push(diagnostic);
        }
    }

    return diagnostics;
}

/**
 * Parses a single line of text to check if it contains a TODO or FIXME comment.
 * Strips the leading '//' and any spaces before matching.
 * 
 * @param line The text line to parse.
 * @returns The content of the TODO/FIXME comment if found, otherwise an empty string.
 */
export function parseLine(line: string): string
{
    let uncommentedLine = line.replace(/^\/\/\s*/, '');
    let diagnosticToAdd = "";

    if (uncommentedLine.startsWith("TODO") || uncommentedLine.startsWith("FIXME"))
    {
        diagnosticToAdd = uncommentedLine;
    }

    return diagnosticToAdd;
}
