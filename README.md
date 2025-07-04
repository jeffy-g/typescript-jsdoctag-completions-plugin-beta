![GitHub](https://img.shields.io/github/license/jeffy-g/typescript-jsdoctag-completions-plugin-beta?style=plastic)

# TypeScript JSDoc Tag Completions Plugin

This plugin provides JSDoc tag completions and displays detailed documentation for each tag.

 + Using the __Preset API__, you can define __documentation__ and __syntax__ for each JSDoc `tag`.  
   These definitions will appear in the __completion details__ shown by your editor.

> ## Installation & Quick Start

```bash
$ npm i --save-dev typescript typescript-jsdoctag-completions-plugin
```

Next, configure the plugin in your `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "target": "es2019",
    "module": "esnext",
    "strict": true,
    // In TypeScript 5.x, compilerOptions/locale was removed,
    // so Moved locale to plugin settings.
    // However, for older versions of TypeScript,
    // this value is still read by the plugin as before.
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
        // If not set, use the OS locale
        "locale": "ja"
      }
    ]
  }
}
```

Then launch [Visual Studio Code](https://code.visualstudio.com/download) or your preferred TypeScript editor.

> ## About JSDoc Tag Presets

The plugin supports two types of presets:

* Built-in presets:

  | Preset name | Details                                              |
  | :---------- | :--------------------------------------------------- |
  | default     | TypeScript built-in JSDoc tags and Inline JSDoc tags |
  | closure     | Closure Compiler JSDoc tags                          |

* Custom presets:

  To create your own preset, implement `TJSDocTagRawPreset` as defined in preset-api.d.ts:

  [https://github.com/jeffy-g/typescript-jsdoctag-completions-plugin-beta/blob/master/lib/preset-api.d.ts#L110](https://github.com/jeffy-g/typescript-jsdoctag-completions-plugin-beta/blob/master/lib/preset-api.d.ts#L110)

> ## `Locale` Priority

The priority for resolving the locale setting is:

1. Project configuration (tsconfig.json, etc.)

   * VSCode settings (vscode extension [vscode-typescript-jsdoctag-completions](https://marketplace.visualstudio.com/items?itemName=jeffy-g.vscode-typescript-jsdoctag-completions))
2. OS locale

> ## Usage Tips

* Set the TypeScript version in VSCode: ensure that the TypeScript version in VSCode is set to the version installed in your project.
* Include your source files in tsconfig.json: The plugin only applies to files listed in the "include" section.

> ## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

