import * as vscode from 'vscode';

export class Parse
{
    private keywords: string[];

    constructor(keywords: string[])
    {
        this.keywords = keywords;
    }

    /**
     * Parses the given document to find comment lines starting with "//".
     * For each such line, it checks whether it starts with a configured keyword
     * and converts matching comments into Diagnostics.
     *
     * @param document The text document to parse.
     * @returns An array of vscode.Diagnostic objects created from matching comments.
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
                const startChar = document.lineAt(line).firstNonWhitespaceCharacterIndex;
                const range = new vscode.Range(line, startChar, line, readLine.length + startChar);

                // Parse the comment line and check whether it matches a configured keyword
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
     * Parses a single comment line to determine whether it starts with
     * one of the configured keywords.
     * Removes the leading '//' and any following whitespace before matching.
     *
     * @param line The comment line to parse (starting with "//").
     * @returns The comment content if a matching keyword is found, otherwise an empty string.
     */
    private parseLine(line: string): string
    {
        let uncommentedLine = line.replace(/^\/\/\s*/, '');
        let diagnosticToAdd = "";

        // Check the comment content against each configured keyword.
        // If a match is found, return the comment content.
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
