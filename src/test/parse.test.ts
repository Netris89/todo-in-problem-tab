import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { Parse } from './../parse';
import { SourceText } from '../sourceText';

suite('Parser Test Suite', () =>
{
    let keywords = ["TODO", "FIXME"];
    const parser = new Parse(keywords,"");

    test('creates diagnostics for comments with keywords', async () =>
    {
        const fakeDocument = new SourceText("// TODO one\nconst x = 1;\n// FIXME two");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 2);
    });

    test('detects keyword without space after comment marker', async () =>
    {
        const fakeDocument = new SourceText("//TODO one\nconst x = 1;\n");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('ignores keyword inside string literal', async () =>
    {
        const fakeDocument = new SourceText("const x = \"//TODO one\";");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('ignores keyword in concatenated strings', async () =>
    {
        const fakeDocument = new SourceText("const a = \"hello\" + \"world // TODO not a comment\";");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('ignores keyword in string with escaped quotes', async () =>
    {
        const fakeDocument = new SourceText("const a = \"this is a \\\"quoted\\\" string // TODO comment\";");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('sets diagnostic message to comment content', async () =>
    {
        const fakeDocument = new SourceText("// TODO one\nconst x = 1;");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0]?.message, "TODO one");
    });

    test('ignores comments without keyword', async () =>
    {
        const fakeDocument = new SourceText("// Hello\nconst x = 1;");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('ignores empty comments', async () =>
    {
        const fakeDocument = new SourceText("//");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('reports comment start at the first // occurrence, not a // inside the comment text', async () =>
    {
        const fakeDocument = new SourceText("const x = 1; // see https://example.com TODO fix");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0]?.startChar, 13);
    });

    test('matches keywords containing regex special characters literally', async () =>
    {
        const regexKeywordParser = new Parse(["TODO(1)"], "");
        const fakeDocument = new SourceText("// TODO(1) fix this later");

        const diagnostics = regexKeywordParser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('does not mistake a quoted string inside the comment text for being inside a code string', async () =>
    {
        const fakeDocument = new SourceText('const a = "hello"; // TODO: rename "x" variable');

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('detects a comment using # as the sign when language is python', async () =>
    {
        const pythonParser = new Parse(["TODO"], "python");
        const fakeDocument = new SourceText("x = 1  # TODO fix this");

        const diagnostics = pythonParser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('detects a comment using # as the sign when language is powershell', async () =>
    {
        const powershellParser = new Parse(["TODO"], "powershell");
        const fakeDocument = new SourceText("$x = 1  # TODO fix this");

        const diagnostics = powershellParser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('detects a comment using -- as the sign when language is sql', async () =>
    {
        const sqlParser = new Parse(["TODO"], "sql");
        const fakeDocument = new SourceText("SELECT 1 -- TODO fix this");

        const diagnostics = sqlParser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('falls back to // for an unrecognized language', async () =>
    {
        const unknownParser = new Parse(["TODO"], "some-unknown-language");
        const fakeDocument = new SourceText("const x = 1; // TODO fix this");

        const diagnostics = unknownParser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('matches the language name case-insensitively', async () =>
    {
        const pythonParser = new Parse(["TODO"], "Python");
        const fakeDocument = new SourceText("x = 1  # TODO fix this");

        const diagnostics = pythonParser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('does not detect a // comment when language uses a different sign', async () =>
    {
        const pythonParser = new Parse(["TODO"], "python");
        const fakeDocument = new SourceText("x = 1  // TODO fix this");

        const diagnostics = pythonParser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });
});
