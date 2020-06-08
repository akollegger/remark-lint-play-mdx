import rule from 'unified-lint-rule';
import visit from 'unist-util-visit';
import generated from 'unist-util-generated';

import { VFile } from 'vfile';
import { Node } from 'unist';

import { parseAST as parseJsxAst } from '@literal-jsx/parser';

export const REJECTED_ELEMENT_REASON = 'Restricted JSX in markdown. See ...?';
export const REJECTED_ATTR_REASON =
  'JSX event handler attributes are not allowed.';
export const REJECTED_SYNTAX_REASON_PREFIX = 'Synax error:';

// export interface RestrictedJsxOptions {
//   accepted: string[]
// }

function noJsx(tree: Node, file: VFile, accept: string[] = []) {
  const accepted = (tagName: string) => accept.includes(tagName);

  visit(tree, 'jsx', markdownVisitor);

  function markdownVisitor(node: any) {
    if (!generated(node) && !/^\s*<!--/.test(node.value)) {
      try {
        const jsxAst = parseJsxAst(node.value);
        visit(jsxAst, (jsxElement: any) => {
          switch (jsxElement.type) {
            case 'Element':
              if (!accepted(jsxElement.name.name)) {
                file.message(REJECTED_ELEMENT_REASON, node);
              }
              jsxElement.attributes.forEach((attr: any) => {
                if (attr.name.name.startsWith('on')) {
                  file.message(REJECTED_ATTR_REASON, node);
                }
              });
              break;
          }
        });
      } catch (e) {
        const reason = `${REJECTED_SYNTAX_REASON_PREFIX} unexpected ${e.token.type} token '${e.token.text}'`;
        file.message(reason, node);
      }
    }
  }
}

export const remarkLintRestrictJsx = rule('remark-lint:no-jsx', noJsx);

export default remarkLintRestrictJsx;
