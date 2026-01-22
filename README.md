# todo-in-problem-tab 

todo-in-problem-tab is a VSCode extension that move comments with various keywords (TODO, FIXME, etc.) into the problem tab as information.

## Features

This extension scans the opened document for comments with the various keywords (TODO & FIXME only at the moment). Each of those comments are then turned into a diagnostic and put them in the problem tab.

## Planned Feature

This is only the first version and as such just has basic feature.   
Planned features are, in no specific order :

- Add more keywords.
- Add the possibility to add user-defined keywords.
- Parse comments written on the same like as normal code (at the moment, only lines starting with // are parsed).
- Add support for languages not using // for comments.

## Known Issues

Feel free to report any issue you find. Known issues will be listed here if there are any.

## Release Notes

Below, you can find changelogs of the releases.

### 0.1

Initial release of the extension.
