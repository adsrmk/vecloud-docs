import { defineConfig } from 'fumadocs-mdx/config';
import { remarkStructureDefaultOptions } from 'fumadocs-core/mdx-plugins/remark-structure';

export default defineConfig({
  mdxOptions: {
    remarkStructureOptions: {
      types(node) {
        if (
          node.type === 'mdxJsxFlowElement' &&
          ['PortalScreenshot', 'PortalWalkthrough', 'Topics', 'DocsActions'].includes(node.name ?? '')
        )
          return false;
        return remarkStructureDefaultOptions.types.includes(node.type);
      },
    },
  },
});
