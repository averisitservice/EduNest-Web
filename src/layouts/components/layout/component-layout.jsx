import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import { kebabCase } from 'es-toolkit';
import { useCallback } from 'react';

import { PrimaryNav, SecondaryNav } from './component-nav';
import { useHashScroll, useScroll } from './hooks';
import { FlexibleSection } from './styles';

// ----------------------------------------------------------------------

const OFFSET_TOP = 120;

export function ComponentLayout({
  heroProps,
  sectionData,
  queryClassName = 'scroll__to__view',
  offsetValue = 0.3, // 0 ~ 1 => 0% => 100%
}) {
  const activeIndex = useScroll(queryClassName, offsetValue);
  const scrollToHash = useHashScroll(OFFSET_TOP);

  const scrollToSection = useCallback(
    (index) => {
      const sections = document.querySelectorAll(`.${queryClassName}`);
      if (sections[index]) {
        const id = sections[index].id;
        scrollToHash(`#${id}`);
      }
    },
    [queryClassName, scrollToHash]
  );

  const renderPrimaryNav = () => (
    <PrimaryNav />
  );

  const renderSecondaryNav = () =>
    !!sectionData?.length && (
      <SecondaryNav navData={sectionData} activeItem={activeIndex} onClickItem={scrollToSection} />
    );

  const renderContent = () => (
    <FlexibleSection>
      {sectionData?.map((section) => {
        const hashId = `${kebabCase(section.name)}`;

        return (
          <Card key={section.name} id={hashId} className={queryClassName}>
            <CardHeader
              titleTypographyProps={{
                component: Link,
                href: `#${hashId}`,
                color: 'inherit',
                sx: { display: 'inline-flex', '&:hover': { opacity: 0.8 } },
              }}
              title={section.name}
              subheader={section.description}
            />
            <CardContent>{section.component}</CardContent>
          </Card>
        );
      })}
    </FlexibleSection>
  );

  return (
    <>
      {heroProps?.topNode}
      {heroProps?.bottomNode}
      {renderPrimaryNav()}
      {renderContent()}
      {renderSecondaryNav()}
    </>
  );
}
