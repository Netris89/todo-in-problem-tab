import * as assert from 'assert';

import * as vscode from 'vscode';
import { build } from '../diagnostic';

suite('Diagnostic Builder Test Suite', () =>
{
    test('computes end character from startChar and lineLength', () =>
    {
        const diagnostic = build(0, 0, 0, 10, 10, "test");

        assert.strictEqual(diagnostic.range.end.character, 10);
    });

    test('creates diagnostic with correct range', () =>
    {
        const diagnostic = build(0, 0, 0, 10, 10, "test");

        assert.strictEqual(diagnostic.range.start.line, 0);
        assert.strictEqual(diagnostic.range.start.character, 0);
        assert.strictEqual(diagnostic.range.end.line, 0);
        assert.strictEqual(diagnostic.range.end.character, 10);
    });

    test('sets diagnostic message from provided text', () =>
    {
        const diagnostic = build(0, 0, 0, 0, 0, "test");

        assert.strictEqual(diagnostic.message, "test");
    });

    test('sets diagnostic severity to Information', () =>
    {
        const diagnostic = build(0, 0, 0, 0, 0, "test");

        assert.strictEqual(diagnostic.severity, vscode.DiagnosticSeverity.Information);
    });

    test('handles zero lineLength correctly', () =>
    {
        const diagnostic = build(0, 0, 0, 0, 0, "test");

        assert.strictEqual(diagnostic.range.end.character, 0);
    });
});