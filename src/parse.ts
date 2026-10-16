import { ParsedDiagnostic } from './parsedDiagnostic';
import { SourceText } from './sourceText';

/**
 * Parses a text document to extract comment-based diagnostics.
 *
 * This class scans a `SourceText` for line comments (`//`, `#` or `--`
 * depending on the language) and checks their content against a
 * predefined list of keywords.
 * When a matching keyword is found, a `ParsedDiagnostic`
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
     * Parses the given document to find lines containing a comment sign.
     * For each such line, it checks whether it contains a configured keyword
     * and converts matching comments into ParsedDiagnostics.
     *
     * @param document The text document to parse.
     * @returns An array of ParsedDiagnostic objects created from matching comments.
     */
    public parseDocument(document: SourceText): ParsedDiagnostic[]
    {
        let diagnostics: ParsedDiagnostic[] = [];

        // Loops through the whole document to find comments
        for (let line = 0; line < document.lineCount(); line++)
        {
            // Remove leading whitespace so the line starts at its first visible character
            const readLine = document.lineAt(line).trimStart();
            // Column of the first non-whitespace character in the original line (-1 if the line is blank). Used to convert indexes in readLine back to document columns
            const startChar = document.lineAt(line).search(/\S/);

            // Index of the last occurrence of the comment sign in the trimmed line, or -1 if the line has no comment
            const index = readLine.indexOf(this.commentSign);
            if (index !== -1)
            {
                const parsedLine = this.parseLine(readLine);

                // Parse the comment line and check whether it matches a configured keyword
                if (parsedLine !== "")
                {
                    const diagnostic: ParsedDiagnostic = {
                        startLine: line,
                        startChar: startChar + index, // Index in the trimmed line converted back to a column in the original line
                        endLine: line,
                        endChar: readLine.length + startChar, // The range extends to the end of the line
                        message: parsedLine
                    };

                    diagnostics.push(diagnostic);
                }
            }
        }

        return diagnostics;
    }

    /**
     * Parses a single line to determine whether it contains
     * one of the configured keywords.
     * Removes a leading '//' (if any) and any following whitespace before matching.
     * Ignores the line if the comment sign is inside a string literal.
     *
     * @param line The line to parse (may contain code before the comment).
     * @returns The text from the matching keyword to the end of the line, otherwise an empty string.
     */
    private parseLine(line: string): string
    {
        let diagnosticToAdd = "";

        // If the comment is inside a string litteral, ignores it
        if (this.isCommentInsideString(line) === false)
        {
            // Strip a leading "//" and the whitespace after it. Does nothing if the line does not start with "//"
            let uncommentedLine = line.replace(/^\/\/\s*/, ''); // TODO : make this return the true comment, not only sometimes

            // Check the comment content against each configured keyword.
            // If a match is found, return the comment content.
            this.keywords.forEach(keyword =>
            {
                const keywordIndex = uncommentedLine.indexOf(keyword);

                // Keep the text from the keyword to the end of the line. If several keywords match, the last one in the list wins
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

        // No quote on the line, so the comment sign cannot be inside a string
        if (line.indexOf('"') < 0)
        {
            return code;
        }

        // inString flips at every quote: true between an opening and a closing quote
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

            // At the first occurrence of the comment sign, check whether we are currently inside a string. Escaped quotes are not handled
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
        // Languages sharing the same comment sign are grouped. The default case covers C-like languages
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
