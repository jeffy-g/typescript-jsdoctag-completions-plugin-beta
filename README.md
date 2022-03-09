[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jeffy-g/typescript-jsdoctag-completions-plugin-beta.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jeffy-g/typescript-jsdoctag-completions-plugin-beta/context:javascript)
![GitHub](https://img.shields.io/github/license/jeffy-g/typescript-jsdoctag-completions-plugin-beta?style=plastic)

# TypeScript JSDoc Tag Completions Plugin

This plugin provides jsdoc tag completion and completion details. (with document of tag

 + In the __Preset API__, by defining __documentation__ and __syntax__ for each `tag`,  
   it will be displayed in the __completion detail__.

> ## How to try?

```
$ npm install --save-dev typescript typescript-jsdoctag-completions-plugin
```

next, configure plugin to `tsconfig.json`.

```jsonc
{
  "compilerOptions": {
    "target": "es2019",
    "module": "esnext",
    "strict": true,
    // plugin refers to the value of `@compilerOptions/locale`
    // If not set, use the OS locale
    "locale": "ja",
    "plugins": [
      {
        "name": "typescript-jsdoctag-completions-plugin",
        // Plugin specific configuration
        "preset": "closure", // builtin preset is "default" and "closure"
        "verbose": true      // enable/disable plugin logging
      }
    ]
  }
}
```

then launch vscode, etc


> ## About JSDoc Tag Preset

  * plugin builtin

| Preset name | Details |
|:---|:---|
| default | [TypeScript](https://github.com/microsoft/TypeScript) builtin JSDoc Tags with [Inline JSDoc Tags](https://jsdoc.app/) |
| closure | [Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler) JSDoc Tags |

  * external defined preset

    + To create your own preset, implement `TJSDocTagRawPreset` as defined in [preset-api.d.ts](https://github.com/jeffy-g/typescript-jsdoctag-completions-plugin-beta/blob/master/lib/preset-api.d.ts#L109)


> ## `Locale` priority

  + The priority to which the `locale` applies

    * #1 ts project (tsconfig.json etc)

      * #1-2 vscode setting (vscode extension [vscode-typescript-jsdoctag-completions](https://marketplace.visualstudio.com/items?itemName=jeffy-g.vscode-typescript-jsdoctag-completions))

    * #2 OS native



> ### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
