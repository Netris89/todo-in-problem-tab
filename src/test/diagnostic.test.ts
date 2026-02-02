import * as assert from 'assert';

import * as vscode from 'vscode';
import { DiagnosticManager } from '../diagnostic';
import { Parse } from '../parse';

suite('Diagnostic Builder Test Suite', () =>
{
    test("adds diagnostics with correct messages, ranges and severity", () =>
    {
        const keywords = ["TODO", "FIXME"];
        const parser = new Parse(keywords);
        const collection = vscode.languages.createDiagnosticCollection("diagnostics");
        const manager = new DiagnosticManager(parser, collection);

        const fakeDocument = {
            getText: () => "// TODO: test\nconst x = 42;\n// FIXME: bug",
            languageId: "typescript",
            uri: vscode.Uri.parse("file:///test.ts")
        } as vscode.TextDocument;

        manager.updateDiagnostics(fakeDocument);

        const diagnostics = collection.get(fakeDocument.uri) ?? [];
        assert.strictEqual(diagnostics.length, 2);

        assert.strictEqual(diagnostics[0].message, "TODO: test");
        assert.strictEqual(diagnostics[0].severity, vscode.DiagnosticSeverity.Information);
        assert.strictEqual(diagnostics[0].range.start.line, 0);
        assert.strictEqual(diagnostics[0].range.start.character, 0);
        assert.strictEqual(diagnostics[0].range.end.character, 13);

        assert.strictEqual(diagnostics[1].message, "FIXME: bug");
        assert.strictEqual(diagnostics[1].severity, vscode.DiagnosticSeverity.Information);
        assert.strictEqual(diagnostics[1].range.start.line, 2);
        assert.strictEqual(diagnostics[1].range.start.character, 0);
        assert.strictEqual(diagnostics[0].range.end.character, 13);
    });

    test("deletes diagnostics safely", () =>
    {
        const keywords = ["TODO"];
        const parser = new Parse(keywords);
        const collection = vscode.languages.createDiagnosticCollection("diagnostics");
        const manager = new DiagnosticManager(parser, collection);

        const fakeDocument = {
            getText: () => "// TODO: test",
            languageId: "typescript",
            uri: vscode.Uri.parse("file:///test.ts")
        } as vscode.TextDocument;

        manager.updateDiagnostics(fakeDocument);
        manager.deleteDiagnostics(fakeDocument);

        const diagnostics = collection.get(fakeDocument.uri) ?? [];
        assert.strictEqual(diagnostics.length, 0);
    });
});