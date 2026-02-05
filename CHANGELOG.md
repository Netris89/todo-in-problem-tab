# Change Log

All notable changes to the "todo-in-problem-tab" extension will be documented in this file.

## 0.1

- Initial release of the extension.

## 0.2

- Add support for user-defined keywords.

## 0.3

- Add support for comments on the same line as code.

### 0.3.1

- Fix bug where uncommented lines would try to add a negative length squiggle line.

### 0.3.2

- Refactor the whole extension to make it more easily testable and maintanable.
- Rewrite the parser to make it more intelligent in detecting comments in string litterals.

### 0.3.3

- Add live keyword update so changes apply without restarting VS Code.