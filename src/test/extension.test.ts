import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { Parse } from './../parse';


suite('Extension Test Suite', () =>
{
    vscode.window.showInformationMessage('Start all tests.');

    let keywords = ["TODO", "FIXME"];
    const parser = new Parse(keywords);

    test('parseDocument detects comments', async () =>
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
});
