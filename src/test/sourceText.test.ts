import * as assert from 'assert';
import { SourceText } from '../sourceText';

suite('SourceText Test Suite', () =>
{
    test('transforms a string in multiple lines', () =>
    {
        const text = "Line1\nLine2";

        const convertedText = new SourceText(text);

        assert.strictEqual(convertedText.lineCount(),2);
    });

    test('returns the expected text', () =>
    {
        const text = "Line1\nLine2";

        const convertedText = new SourceText(text);

        assert.strictEqual(convertedText.lineAt(1),"Line2");
    });

    test('returns empty string if the index is out of bound', () =>
    {
        const text = "Line1\nLine2";

        const convertedText = new SourceText(text);

        assert.strictEqual(convertedText.lineAt(2),"");
    });
});