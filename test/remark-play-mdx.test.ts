import {VFile} from 'vfile'

import {remarkLintPlayMdx} from '../src/'
import {REJECTED_ELEMENT_REASON, REJECTED_ATTR_REASON, REJECTED_SYNTAX_REASON_PREFIX} from '../src/remark-lint-restrict-jsx'

describe('remark lint playable MDX', () => {
  it('accepts basic markdown', () => {
    const md = `# title
- one
- two
- three
`;
remarkLintPlayMdx().process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  });
  it('complains about blockquote indentation spacing', () => {
    const md = `# title

> This blockquote uses a single space, which is ok

>   This blockquote uses three spaces, which is bad
`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(/Remove 2 spaces between block quote and content/)
    });
  });

  it('accepts proper checkbox character style', () => {
    const md = `# title

- [x] this is done
- [ ] this is not yet done

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  });

  it('complains about unexpected checkbox character style', () => {
    const md = `# title

- [X] this is done
- [ ] this is not yet done

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(/Checked checkboxes should use `x` as a marker/)
    });
  });

  it('complains about unexpected checkbox character style', () => {
    const md = `# title

- [x] this is done
- [\t] this is not yet done

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(/Unchecked checkboxes should use ` ` as a marker/);
    });
  });

  it('accepts codeblocks that are fenced', () => {
    const md = `# title

\`\`\`cypher
MATCH (n) RETURN n
\`\`\`

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  });

  it('complains about codeblocks that are indented', () => {
    const md = `# title

    MATCH (n) RETURN n

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(/Code blocks should be fenced/);
    });
  });


  it('accepts codeblocks that are fenced with `\``', () => {
    const md = `# title

\`\`\`cypher
MATCH (n) RETURN n
\`\`\`

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  });

  it('complains about codeblocks that are fenced with `~`', () => {
    const md = `# title
~~~
    MATCH (n) RETURN n
~~~
`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(/Fenced code should use `` ` `` as a marker/);
    });
  });

  it('accepts `_` for emphasis (italics)', () => {
    const md = `# title

_this will be italicized_
`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  });

  it('complains about `*` for emphasis (italics)', () => {
    const md = `# title

*looks like bold, but bold needs two asterisks*

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(/Emphasis should use `_` as a marker/);
    });
  }); 


  it('accepts `**` for strong (bold)', () => {
    const md = `# title

**this will be bold**
`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  });

  it('complains about using `__` for strong (bold)', () => {
    const md = `# title

__this looks like an internal pragma or something__

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(/Strong should use `\*` as a marker/);
    });
  }); 


  it('rejects html `<div/>` elements', () => {
    const md = `# title

<div>content of div</div>

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(REJECTED_ELEMENT_REASON);
    });
  }); 


  it('accepts html `<!-- -->` comment elements', () => {
    const md = `# title

<!-- this is an html comment -->

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  }); 

  it('complains about unacceptable `<BadElement/>` JSX elements', () => {
    const md = `# title

<BadElement>content of JSX element</BadElement>

`;
remarkLintPlayMdx()
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(REJECTED_ELEMENT_REASON);
    });
  }); 


  it('accepts specific `<OK/>` JSX elements', () => {
    const md = `# title

<OK>content of JSX element</OK>

`;
remarkLintPlayMdx(['OK'])
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  }); 

  it('accepts plain string attributes like `<OK msg="go"/>` ', () => {
    const md = `# title

<OK msg="go">content of JSX element</OK>

`;
remarkLintPlayMdx(['OK'])
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(0);
    });
  }); 

  it('rejects javascript event handler attributes like `<BadAttr onload="alert(1)"/>` ', () => {
    const md = `# title

<BadAttr onload="alert(1)">content of JSX element</BadAttr>

`;
remarkLintPlayMdx(['BadAttr'])
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(REJECTED_ATTR_REASON);
    });
  }); 

  it('rejects javascript attributes which evaluate code like `<BadAttr noEvalAllowed={alert(1)}/>` ', () => {
    const md = `# title

<BadAttr noEvalAllowed={alert(1)}>content of JSX element</BadAttr>

`;
remarkLintPlayMdx(['BadAttr'])
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(REJECTED_SYNTAX_REASON_PREFIX);
    });
  }); 

  it('rejects javascript attributes which evaluate code like `<BadAttr noEvalAllowed={() => alert(1)}/>` ', () => {
    const md = `# title

<BadAttr noEvalAllowed={() => alert(1)}>content of JSX element</BadAttr>

`;
remarkLintPlayMdx(['BadAttr'])
    .process(md, (_, file:VFile) => {
      expect(file.messages).toHaveLength(1);
      expect(file.messages[0].reason).toMatch(REJECTED_SYNTAX_REASON_PREFIX);
    });
  }); 

});
