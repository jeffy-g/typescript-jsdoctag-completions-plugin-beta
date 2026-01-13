![GitHub](https://img.shields.io/github/license/jeffy-g/typescript-jsdoctag-completions-plugin-beta?style=plastic)
![NPM Version](https://img.shields.io/npm/v/typescript-jsdoctag-completions-plugin?style=plastic&color=green)
![npm bundle size](https://img.shields.io/bundlephobia/min/typescript-jsdoctag-completions-plugin?style=plastic)
![NPM Downloads](https://img.shields.io/npm/dm/typescript-jsdoctag-completions-plugin?style=plastic)


# TypeScript JSDoc Tag Completions Plugin

This plugin provides JSDoc tag completion and detailed documentation for each tag.

+ In the __Preset API__, define __documentation__ and __syntax__ for each `tag`  
  to display detailed information in the completion UI.

## Features

+ JSDoc tag completion with syntax-aware suggestions
+ Completion details for tag documentation, syntax, and aliases
+ Hover details for JSDoc tags (Quick Info); see the animation below
+ Locale-aware documentation output
+ Preset-based tag definitions (`default`, `closure`, or custom)

## Requirements

+ Works with the TypeScript Language Service (e.g. VSCode)
+ Applies to TypeScript sources (`.ts`, `.tsx`, `.mts`, `.cts`)

## This plugin follows standard JSDoc syntax and provides completions.

+ JSDoc blocks start with `/**`.
+ Each JSDoc line starts with `/\s+\*?\s/`.
+ JSDoc tags can be grouped into `marker`, `simple`, and `complex`.
  + `Marker` tags have no body.
  + `Simple` tags consist of a tag and a body (inline tags such as `@link`).
  + `Complex` tags consist of a tag, an optional type annotation, and a body (inline tags such as `@link`).

## Behavior

+ Hovering a JSDoc tag displays its details.

![mouse-hover](https://cdn.jsdelivr.net/gh/jeffy-g/typescript-jsdoctag-completions-plugin-beta@master/assets/mouse-hover.gif)

> NOTE: When completion is triggered, the same details are shown in Quick Info.

## Installation

```
$ npm install --save-dev typescript typescript-jsdoctag-completions-plugin
```

Configure the plugin in `tsconfig.json`.

Minimal configuration:

```jsonc
{
  "compilerOptions": {
    "plugins": [
      { "name": "typescript-jsdoctag-completions-plugin" }
    ]
  }
}
```

Custom preset configuration:

```jsonc
{
  "compilerOptions": {
    "target": "es2019",
    "module": "esnext",
    "strict": true,
    // In TypeScript 5.x, compilerOptions/locale was removed,
    // so Moved locale to plugin settings.
    // however, for older versions of ts,
    // this value is still referenced as before from this plugin.
    // "locale": "ja",
    "plugins": [
      {
        "name": "typescript-jsdoctag-completions-plugin",
        // Plugin specific configuration
        // builtin preset is "default" and "closure".
        // If you want to use a jsdoc tag preset that you have defined yourself based on the preset API,
        // specify the path of that module.
        "preset": "closure",
        "verbose": true,     // enable/disable plugin logging
        // plugin refers to the value of `@compilerOptions/plugins[@name=typescript-jsdoctag-completions-plugin]/locale`
        // *Changing this value will immediately change the translation language.*
        // If not set, use the OS locale
        "locale": "ja"
      }
    ]
  }
}
```

Launch [Visual Studio Code](https://code.visualstudio.com/download) (or another supported editor).

## Configuration Notes

+ `verbose`: Enable plugin logging (`true` or `false`).
+ `locale`: Overrides documentation language (falls back to OS locale when omitted).
+ `preset`: Use `default`, `closure`, or a custom preset module path.


## JSDoc Tag Presets

  * Built-in presets

| Preset name | Details |
|:---|:---|
| default | [TypeScript](https://github.com/microsoft/TypeScript) builtin JSDoc Tags with [Inline JSDoc Tags](https://jsdoc.app/) |
| closure | [Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler) JSDoc Tags |

  * Custom presets

    + To create your own preset, implement `TJSDocTagRawPreset` as defined in [preset-api.d.ts](https://github.com/jeffy-g/typescript-jsdoctag-completions-plugin-beta/blob/master/lib/preset-api.d.ts#L110).


## <a name="locale-priority">`Locale` priority</a>

  + Locale resolution priority

    * #1 ts project (tsconfig.json, etc)

      * #1-2 vscode setting (vscode extension [vscode-typescript-jsdoctag-completions](https://marketplace.visualstudio.com/items?itemName=jeffy-g.vscode-typescript-jsdoctag-completions))

    * #2 OS native

## Usage Notes

  + Set the TypeScript version in VSCode: Ensure the version in VSCode matches the version installed in your project.

  + Include sources in tsconfig.json: The plugin only applies to sources specified in the "include" section of tsconfig.json.

If completions do not appear, verify the workspace TypeScript version and that the file is included in tsconfig.


### License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
