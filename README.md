# todo-in-problem-tab 

One feature I liked with the Java Extension pack was that TODO were put in the problem tab so they were easy to see. I asked if it was possible to implement a similar feature gobally to VSCode but was kindly told extensions were already doing it and pointed to said extensions. None of the extensions I was told were doing what I asked so I did it myself.  

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)![Version](https://img.shields.io/badge/version-0.3.3-blue?style=for-the-badge)![License](https://img.shields.io/badge/license-GPLv3-red?style=for-the-badge)

## Features

This extension scans the opened document for comments with the various keywords (TODO, FIXME, BUG & HACK by default.). Each of those comments are then turned into a diagnostic and put in the problem tab.  
Either on a separate line.

![screenshot](screenshots/todo.png)

Or the same line as code.

![screenshot](screenshots/sameLine.png)

Default keywords are provided but you can extend this list to your liking.

![options](screenshots/options.png)

## Planned Feature

This is only the first version and as such just has basic feature.   
Planned features are, in no specific order :

- Add support for languages not using // for comments.

## Known Issues

Known issues are listed here.

## Release Notes

If you want to now what's new, go read the [changelog](https://github.com/Netris89/todo-in-problem-tab/blob/master/CHANGELOG.md)

## Get it

You can download the extension directly from [Github](https://github.com/Netris89/todo-in-problem-tab), [the VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=netris.todo-in-problem-tab), [the Open VSX registry](https://open-vsx.org/extension/Netris/todo-in-problem-tab) or [directly from VSCode](vscode:extension/netris.todo-in-problem-tab)
