import babelJest from 'babel-jest';

const babelTransformer = babelJest.createTransformer({
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'],
});

export default {
  process(sourceText, sourcePath, options) {
    const transformed = sourceText.replace(
      /import\.meta\.env\.(\w+)/g,
      (match, key) => {
        if (key === 'VITE_BROWSER') return JSON.stringify('chrome');
        return JSON.stringify(undefined);
      }
    );
    return babelTransformer.process(transformed, sourcePath, options);
  },
  getCacheKey(sourceText, sourcePath, options) {
    return babelTransformer.getCacheKey(sourceText, sourcePath, options);
  },
};
