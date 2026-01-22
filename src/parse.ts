import * as vscode from 'vscode';

export class Parse
{
    private keywords: string[];

    constructor(keywords: string[])
    {
        this.keywords = keywords;
    }

    /**
     * Parses the given document to find commented lines.
     * For each line starting with "//", it calls parseLine to check
     * if it contains a TODO or FIXME and converts it to a Diagnostic.
     * 
     * @param document The text document to parse.
     * @returns An array of vscode.Diagnostic objects for the TODO/FIXME comments found.
     */
    public parseDocument(document: vscode.TextDocument): vscode.Diagnostic[]
    {
        let diagnostics: vscode.Diagnostic[] = [];

        // Loops through the whole document to find comments
        for (let line = 0; line < document.lineCount; line++)
        {
            let readLine = document.lineAt(line).text.trimStart();

            if (readLine.startsWith("//"))
            {
                const range = new vscode.Range(line, 0, line, readLine.length);
                
                // Call parseLine to parse the line and determine if it has the right keyworkd
                if (this.parseLine(readLine) !== "")
                {
                    const diagnostic = new vscode.Diagnostic(range, this.parseLine(readLine), vscode.DiagnosticSeverity.Information);
                    diagnostics.push(diagnostic);
                }
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
    public parseLine(line: string): string
    {
        let uncommentedLine = line.replace(/^\/\/\s*/, '');
        let diagnosticToAdd = "";

        // Loops through each keywords (atm only TODO and FIXME) and compare them to the start of the parsed line.
        // If it does, adds the line to the list of diagnostics.
        this.keywords.forEach(keyword =>
        {
            if (uncommentedLine.startsWith(keyword))
            {
                diagnosticToAdd = uncommentedLine;
            }
        });

        return diagnosticToAdd;
    }
}
