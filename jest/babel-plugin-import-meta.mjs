export default function importMetaBabelPlugin() {
  return {
    visitor: {
      MemberExpression(path) {
        if (
          path.node.object?.type === 'MetaProperty' &&
          path.node.object?.meta?.name === 'import' &&
          path.node.property?.name === 'env'
        ) {
          const envParent = path.parentPath;
          if (envParent.isMemberExpression()) {
            const key = envParent.node.property.name;
            if (key === 'VITE_BROWSER') {
              envParent.replaceWithSourceString("'chrome'");
            }
          }
        }
      },
    },
  };
}
