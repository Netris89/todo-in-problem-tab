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
    private commentSign: string;

    constructor(keywords: string[], language: string)
    {
        this.keywords = keywords;
        this.commentSign = this.getCommentSign(language);
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

            const index = readLine.lastIndexOf(this.commentSign);
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

        // If the comment is inside a string litteral, ignores it
        if (this.isCommentInsideString(line) === false)
        {
            let uncommentedLine = line.replace(/^\/\/\s*/, '');

            // Check the comment content against each configured keyword.
            // If a match is found, return the comment content.
            this.keywords.forEach(keyword =>
            {
                const keywordIndex = uncommentedLine.indexOf(keyword);
                if (keywordIndex !== -1)
                {
                    diagnosticToAdd = uncommentedLine.slice(keywordIndex);
                }
            });
        }

        return diagnosticToAdd;
    }

    /**
     * Analyzes a line of code to determine whether the comment marker
     * (`this.commentSign`) appears inside a double-quoted string literal.
     *
     * The method scans the line character by character, toggling a flag
     * each time it encounters a `"`, to track whether the current position
     * is inside a string. It returns true if the comment marker is located
     * within a string, otherwise false.
     *
     * @param line The line of code to analyze
     * @returns `true` if the comment marker is inside a string literal, otherwise `false`
     */
    private isCommentInsideString(line: string): boolean
    {
        let code = false;
        let inString = false;

        if (line.indexOf('"') < 0)
        {
            return code;
        }

        for (let index = 0; index < line.length; index++)
        {
            if (line[index] === '"')
            {
                if (inString === true)
                {
                    inString = false;
                }
                else
                {
                    inString = true;
                }
            }

            if (index === line.indexOf(this.commentSign) && inString === true)
            {
                code = true;
                break;
            }
        }

        return code;
    }

    /**
     * Returns the line comment marker used in the specified programming language.
     *
     * This method maps a language identifier to its corresponding single-line
     * comment syntax. Supported languages include:
     * - "python" and "powershell" -> "#"
     * - "sql" -> "--"
     * All other languages default to "//".
     *
     * @param language The language identifier of the document.
     * @returns The string used for line comments in the given language.
     */
    private getCommentSign(language: string): string
    {
        switch (language.toLowerCase())
        {
            case "python":
            case "powershell":
                return "#";
            case "sql":
                return "--";
            default:
                return "//";
        }
    }
}
