/* eslint-disable react/no-children-prop */
import './code-highlight-block.css';

import Link from '@mui/material/Link';
import { isExternalLink, mergeClasses } from 'minimal-shared/utils';
import { useMemo } from 'react';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { RouterLink } from 'src/routes/components';

import { Image } from '../image';

import { markdownClasses } from './classes';
import { htmlToMarkdown, isMarkdownContent } from './html-to-markdown';
import { MarkdownRoot } from './styles';

// ----------------------------------------------------------------------

export function Markdown({ children, sx, className, ...other }) {
  const content = useMemo(() => {
    if (isMarkdownContent(`${children}`)) {
      return children;
    }
    return htmlToMarkdown(`${children}`.trim());
  }, [children]);

  return (
    <MarkdownRoot
      children={content}
      components={components}
      rehypePlugins={rehypePlugins}
      /* base64-encoded images
       * https://github.com/remarkjs/react-markdown/issues/774
       * urlTransform={(value) => value}
       */
      className={mergeClasses([markdownClasses.root, className])}
      sx={sx}
      {...other}
    />
  );
}

const rehypePlugins = [rehypeRaw, rehypeHighlight, [remarkGfm, { singleTilde: false }]];

const components = {
  img: ({ ...other }) => (
    <Image
      ratio="16/9"
      className={markdownClasses.content.image}
      sx={{ borderRadius: 2 }}
      {...other}
    />
  ),
  a: ({ href, children, ...other }) => {
    const linkProps = isExternalLink(href)
      ? { target: '_blank', rel: 'noopener' }
      : { component: RouterLink };

    return (
      <Link {...linkProps} href={href} className={markdownClasses.content.link} {...other}>
        {children}
      </Link>
    );
  },
  pre: ({ children }) => (
    <div className={markdownClasses.content.codeBlock}>
      <pre>{children}</pre>
    </div>
  ),
  code({ className, children, ...other }) {
    const language = /language-(\w+)/.exec(className || '');

    return language ? (
      <code {...other} className={className}>
        {children}
      </code>
    ) : (
      <code {...other} className={markdownClasses.content.codeInline}>
        {children}
      </code>
    );
  },
};
