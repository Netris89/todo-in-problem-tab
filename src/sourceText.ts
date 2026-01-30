/**
 * Represents an immutable textual source split into lines.
 *
 * This class is intended to decouple parsers
 * from VS Code to make it easier to unit test.
 */
export class SourceText
{
    private lines: string[] = [];

    /**
     * Creates a SourceText from a raw text string.
     * Line endings are normalized to support both LF and CRLF.
     * @param text Full text content of the source document.
     */
    constructor(text: string)
    {
        this.lines = text.split(/\r?\n/);
    }

    /**
     * Returns the number of lines in the source text.
     * @returns Total line count.
     */
    public lineCount(): number
    {
        return this.lines.length;
    }

    /**
     * Returns the line at the given index.
     * If the index is out of bounds, an empty string is returned.
     * @param line Zero-based line index.
     * @returns The line content, or an empty string if the index is invalid.
     */
    public lineAt(line: number): string
    {
        return this.lines[line] ?? '';
    }
}
