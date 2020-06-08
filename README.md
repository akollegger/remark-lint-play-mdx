# Remark Lint Play MDX

Utilities for linting Markdown that will become playable, safe MDX.

Accepted HTML elements:

- `<!-- -->`

Accepted JSX elements can be passed as an array to `remarkLintPlayMdx()`. 

Usage example:

```
import {remarkLintPlayMdx} from '@akollegger/remark-lint-play-mdx'

const remarkLintPlayMdx(['BadAttr'])

remarkLintPlayMdx(['BadAttr'])
    .process(md, (_, file:VFile) => {
      // file will have messages for any found errors
      file.messages.forEach ( (msg:string) => {
        console.error(msg);
      })
    });
```

## Examples of playable, safe MDX

### Blockquotes

Acceptable, use 1 space at start of line :

```md
> Use one space between the `>` blockquote character and the start of line.
> This is ok, too!
```

Rejected, more than 1 space:

```md
>  Maybe hard to tell, but this line has 2 (!) spaces between the `>` and the start of the line.
>   This is even more indented. 
```

# TSDX Bootstrap

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
