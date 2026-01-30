/**
 * Represents the result of a parsed diagnostic independent of any editor API.
 *
 * This structure describes the location and message of a diagnostic
 * using zero-based line and character positions.
 * It is intended to be converted later into editor-specific
 * diagnostic representations (e.g. VS Code diagnostics).
 */
export type ParsedDiagnostic =
{
    startLine: number;
    startChar: number;
    endLine: number;
    endChar: number;
    message: string;
}