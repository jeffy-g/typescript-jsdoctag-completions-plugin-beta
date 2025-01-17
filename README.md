![GitHub](https://img.shields.io/github/license/jeffy-g/typescript-jsdoctag-completions-plugin-beta?style=plastic)

# TypeScript JSDoc Tag Completions Plugin

This plugin provides jsdoc tag completion and completion details. (with document of tag

 + In the __Preset API__, by defining __documentation__ and __syntax__ for each `tag`,  
   it will be displayed in the __completion detail__.

> ## How to try?

```
$ npm i --save-dev typescript typescript-jsdoctag-completions-plugin
```

next, configure plugin to `tsconfig.json`.

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
        // If not set, use the OS locale
        "locale": "ja"
      }
    ]
  }
}
```

then launch [Visula Studio Code](https://code.visualstudio.com/download), etc


> ## About JSDoc Tag Preset

  * plugin builtin

| Preset name | Details |
|:---|:---|
| default | [TypeScript](https://github.com/microsoft/TypeScript) builtin JSDoc Tags with [Inline JSDoc Tags](https://jsdoc.app/) |
| closure | [Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler) JSDoc Tags |

  * external defined preset

    + To create your own preset, implement `TJSDocTagRawPreset` as defined in [preset-api.d.ts](https://github.com/jeffy-g/typescript-jsdoctag-completions-plugin-beta/blob/master/lib/preset-api.d.ts#L110)


> ## <a name="locale-priority">`Locale` priority</a>

  + The priority to which the `locale` applies

    * #1 ts project (tsconfig.json etc)

      * #1-2 vscode setting (vscode extension [vscode-typescript-jsdoctag-completions](https://marketplace.visualstudio.com/items?itemName=jeffy-g.vscode-typescript-jsdoctag-completions))

    * #2 OS native

> ## Usage Tips

  + Set TypeScript Version in VSCode: Ensure that the TypeScript version in VSCode is set to the version installed in your project.

  + Include Sources in tsconfig.json: The plugin only applies to sources specified in the "include" section of tsconfig.json.



> ### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
