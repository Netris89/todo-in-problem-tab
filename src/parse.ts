// import * as vscode from 'vscode';
import { ParsedDiagnostic } from './parsedDiagnostic';
import { SourceText } from './sourceText';

/**
 * Parses a VS Code text document to extract comment-based diagnostics.
 *
 * This class scans a `vscode.TextDocument` for line comments (`//`) and
 * checks their content against a predefined list of keywords.
 * When a matching keyword is found, an informational `vscode.Diagnostic`
 * is created for the corresponding comment range.
 *
 * The parsing logic is intentionally lightweight and does not perform
 * full lexical analysis; it aims to detect simple comment patterns
 * without interpreting string literals or language grammar in depth.
 */
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
    public parseDocument(document: SourceText): ParsedDiagnostic[]
    {
        let diagnostics: ParsedDiagnostic[] = [];

        // Loops through the whole document to find comments
        for (let line = 0; line < document.lineCount(); line++)
        {
            const readLine = document.lineAt(line).trimStart();
            const startChar = document.lineAt(line).search(/\S/);

            const index = readLine.lastIndexOf("//");
            if (index !== -1)
            {
                const parsedLine = this.parseLine(readLine);

                // Parse the comment line and check whether it matches a configured keyword
                if (parsedLine !== "")
                {
                    const diagnostic: ParsedDiagnostic = {
                        startLine: line,
                        startChar: startChar + index,
                        endLine: line,
                        endChar: readLine.length + startChar,
                        message: parsedLine
                    };

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
        let diagnosticToAdd = "";

        // This is a deliberately simple logic to avoid parsing comments inside string literals.
        // If a double quote appears before "//", the comment is assumed to be part of a string and ignored.
        // This approach is not fully accurate (escaped quotes, multiple strings, template literals, etc.),
        // but it is sufficient for a first iteration and avoids adding a full lexical parser.
        if ((line.indexOf('"') < line.indexOf("//")))
        {
            let uncommentedLine = line.replace(/^\/\/\s*/, '');

            // Check the comment content against each configured keyword.
            // If a match is found, return the comment content.
            this.keywords.forEach(keyword =>
            {
                const keywordIndex = uncommentedLine.search(keyword);
                if (keywordIndex !== -1)
                {
                    diagnosticToAdd = uncommentedLine.slice(keywordIndex);
                }
            });
        }

        return diagnosticToAdd;
    }
}
