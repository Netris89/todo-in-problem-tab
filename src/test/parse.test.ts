import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { Parse } from './../parse';
import { SourceText } from '../sourceText';

suite('Parser Test Suite', () =>
{
    let keywords = ["TODO", "FIXME"];
    const parser = new Parse(keywords);

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
        const fakeDocument = new SourceText("const a = \"hello\" + \"world // not a comment\";");

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('ignores keyword in string with escaped quotes', async () =>
    {
        const fakeDocument = new SourceText("const a = \"this is a \\\"quoted\\\" string // comment\";");

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
});
