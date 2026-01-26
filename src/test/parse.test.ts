import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { Parse } from './../parse';


suite('Parser Test Suite', () =>
{
    vscode.window.showInformationMessage('Start all tests.');

    let keywords = ["TODO", "FIXME"];
    const parser = new Parse(keywords);

    test('creates diagnostics for comments with keywords', async () =>
    {
        const fakeDocument = await vscode.workspace.openTextDocument({
            content: `
                    // TODO one
                    const x = 1;
                    // FIXME two
                    `
        });

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 2);
    });

    test('detects keyword without space after comment marker', async () =>
    {
        const fakeDocument = await vscode.workspace.openTextDocument({
            content: `
                    //TODO one
                    const x = 1;
                    `
        });

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
    });

    test('ignores keyword inside string literal', async () =>
    {
        const fakeDocument = await vscode.workspace.openTextDocument({
            content: `
                    const x = "//TODO one";
                    `
        });

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('sets diagnostic message to comment content', async () =>
    {
        const fakeDocument = await vscode.workspace.openTextDocument({
            content: `
                    // TODO one
                    const x = 1;
                    `
        });

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0]?.message, "TODO one");
    });

    test('sets diagnostic severity correctly', async () =>
    {
        const fakeDocument = await vscode.workspace.openTextDocument({
            content: `
                    // TODO one
                    const x = 1;
                    `
        });

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0]?.severity, vscode.DiagnosticSeverity.Information);
    });

    test('ignores comments without keyword', async () =>
    {
        const fakeDocument = await vscode.workspace.openTextDocument({
            content: `
                    // Hello
                    const x = 1;
                    `
        });

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('ignores empty comments', async () =>
    {
        const fakeDocument = await vscode.workspace.openTextDocument({
            content: `
                    //
                    `
        });

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 0);
    });

    test('sets diagnostic range to comment line', async () =>
    {
        const fakeDocument = await vscode.workspace.openTextDocument({
            content: `
                    first line
                        // TODO one
                    third line
                    `
        });

        const diagnostics = parser.parseDocument(fakeDocument);

        assert.strictEqual(diagnostics.length, 1);
        assert.strictEqual(diagnostics[0].range.start.line, 2);
    });

});
