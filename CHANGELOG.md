# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.7

- Keywords containing special characters (such as parentheses or +) are now matched correctly.
- Comments are no longer wrongly ignored when quotes appear elsewhere on the line.
- Only comments starting with a keyword are now reported.
- Documents that are not real files (git, diff) are no longer analyzed, which removes duplicate diagnostics.

## 0.6

- Comment sign is now based on document language.

## 0.5

- Add live keyword update so changes apply without restarting VS Code.

## 0.4

- Refactor the whole extension to make it more easily testable and maintanable.
- Rewrite the parser to make it more intelligent in detecting comments in string litterals.

## 0.3.2

- Add support for comments on the same line as code.

## 0.3.1

- Fix bug where uncommented lines would try to add a negative length squiggle line.

## 0.2

- Add support for user-defined keywords.

## 0.1

- Initial release of the extension.
