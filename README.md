# todo-in-problem-tab 

One feature I liked with the Java Extension pack was that TODO were put in the problem tab so they were easy to see. I asked if it was possible to implement a similar feature gobally to VSCode but was kindly told extensions were already doing it and pointed to said extensions. None of the extensions I was told were doing what I asked so I did it myself.

## Features

This extension scans the opened document for comments with the various keywords (TODO, FIXME, BUG & HACK by default.). Each of those comments are then turned into a diagnostic and put in the problem tab.

![screenshot](screenshots/todo-in-problem-tab.png)

Default keywords are provided but you can extend this list to your liking.

![options](screenshots/options.png)

## Planned Feature

This is only the first version and as such just has basic feature.   
Planned features are, in no specific order :

- Parse comments written on the same like as normal code (at the moment, only lines starting with // are parsed).
- Add support for languages not using // for comments.

## Known Issues

Feel free to report any issue you find. Known issues will be listed here if there are any.

## Release Notes

Below, you can find changelogs of the releases.

### 0.1

Initial release of the extension.

### 0.2

Add support for user-defined keywords
