const ts = require('typescript');
const esbuildJest = require('esbuild-jest');

const transformer = esbuildJest.createTransformer({
  sourcemap: true,
  loaders: { '.ts': 'tsx' },
});

function replaceViteImports(context) {
  const visit = (node) => {
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isMetaProperty(node.expression) &&
      node.expression.keywordToken === ts.SyntaxKind.ImportKeyword
    ) {
      if (node.name.text === 'env') {
        return ts.factory.createObjectLiteralExpression();
      }
      if (node.name.text === 'glob') {
        return ts.factory.createIdentifier('jestImportMetaGlob');
      }
    }
    return ts.visitEachChild(node, visit, context);
  };
  return (sourceFile) => ts.visitNode(sourceFile, visit);
}

module.exports = {
  createTransformer() {
    return {
      process(content, filename, config, opts) {
        // Erase types while retaining JSX and ESM imports. Jest must hoist
        // mocks before imports become require() calls or JSX becomes React calls.
        const source = ts.transpileModule(content, {
          fileName: filename,
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
            jsx: ts.JsxEmit.Preserve,
            inlineSourceMap: true,
            inlineSources: true,
          },
          transformers: { before: [replaceViteImports] },
        });
        return transformer.process(source.outputText, filename, config, opts);
      },
    };
  },
};
