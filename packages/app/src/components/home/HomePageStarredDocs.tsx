import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';
import { Box } from '@material-ui/core';
import { HorizontalScrollGrid } from '@backstage/core-components';
import StarIcon from '@material-ui/icons/Star';
import DocsIcon from '@material-ui/icons/Description';
import * as tokens from '@bcgov/design-tokens/js';
import { BCGovHeaderText } from './HomeHeaderText';
import { CardGroup, HomeInfoCard } from './CardComponents';
import { useStarredEntities } from '@backstage/plugin-catalog-react';
import React, { useEffect, useState } from 'react';

const defaultButtonText = [
  'View Documentation',
  'See Details',
  'Learn More',
  'Explore Docs',
  'Read Guide',
];

// Mapping of entity names to specific button text
const buttonTextMapping: Record<string, string> = {
  'aps-infra-platform-docs': 'Read the APS guide',
  'bc-developer-guide': 'Build a quality application',
  'chefs-techdocs': 'Spice-up your forms',
  'citz-imb-sso-css-api-npm-package': "View the package's docs",
  'citz-imb-sso-express-npm-package': "Open the package's docs",
  'citz-imb-sso-react-npm-package': "Read the package's docs",
  'digital-trust': 'Explore the Digital Trust docs',
  'common-object-management-service': 'Discover S3 storage solutions',
  'indigenous-languages-in-systems': 'Include Indigenous languages',
  'mobile-developer-guide': 'Review the mobile guide',
  'platform-developer-docs': 'Explore the Private cloud docs',
  'public-cloud-techdocs': 'Explore the Public cloud docs',
  'css-docs': 'View the SSO docs',
};

// override description text for specific entities?
// const descTextMapping: Record<string, string> = {
//   'bc-developer-guide': 'Everything you need to know to build a quality, consistent and compliant application.',
//   'mobile-developer-guide': 'Detailed guidance on the steps and practices you must follow when developing a mobile application.',
//   'platform-developer-docs': 'Learn how to build, deploy, maintain, and retire applications on OpenShift.',
//   'public-cloud-techdocs': 'Learn about building and deploying applications through B.C. government AWS landing zone.',
// };

const getButtonText = (entityName?: string) => {
  // If entity name is provided and exists in mapping, use the mapped text
  if (entityName && buttonTextMapping[entityName]) {
    return buttonTextMapping[entityName];
  }
  // Otherwise use a random default text
  return defaultButtonText[
    Math.floor(Math.random() * defaultButtonText.length)
  ];
};

const truncateDesc = (txt: string | undefined, maxLength: number) => {
  if (!txt) return 'No description available';

  return txt.length > maxLength ? `${txt.substring(0, maxLength)}...` : txt;
};

interface DocsContentProps {
  entityLoader: (catalogApi: any) => Promise<any[]>;
  title: string;
  icon: React.ReactNode;
}

const DocsContent = ({ entityLoader, title, icon }: DocsContentProps) => {
  const catalogApi = useApi(catalogApiRef);
  const [scrollStep, setScrollStep] = useState<number>(320);

  useEffect(() => {
    const updateScrollStep = () => {
      if (window.innerWidth < 600) {
        // xs
        setScrollStep(300);
      } else if (window.innerWidth < 960) {
        // sm
        setScrollStep(400);
      } else {
        // md+
        setScrollStep(480);
      }
    };

    updateScrollStep();
    window.addEventListener('resize', updateScrollStep);
    return () => window.removeEventListener('resize', updateScrollStep);
  }, []);

  const docsEntities = useAsync(
    () => entityLoader(catalogApi),
    [catalogApi, entityLoader],
  ).value;

  if (!docsEntities?.length) return null;

  return (
    <CardGroup>
      <BCGovHeaderText variant="h3" paragraph>
        {title}
      </BCGovHeaderText>

      <div style={{ width: '100%' }}>
        <HorizontalScrollGrid scrollStep={scrollStep}>
          {docsEntities.map((entity: any, idx: number) => {
            const docsLink = `/docs/${
              entity.metadata.namespace || 'default'
            }/${entity.kind.toLowerCase()}/${entity.metadata.name}`;

            return (
              <Box
                display="flex"
                sx={{
                  flexShrink: 0,
                  flexGrow: 0,
                  width: {
                    xs: 280,
                    sm: 380,
                    md: 460,
                  },
                }}
                ml={
                  idx === 0
                    ? tokens.layoutMarginSmall
                    : tokens.layoutMarginMedium
                }
                mr={
                  idx === docsEntities.length - 1
                    ? tokens.layoutMarginSmall
                    : tokens.layoutMarginMedium
                }
                mb={tokens.layoutMarginSmall}
                mt={tokens.layoutMarginSmall}
                key={entity.metadata.uid}
              >
                <HomeInfoCard
                  icon={icon}
                  title={entity.metadata.title || entity.metadata.name}
                  linkProps={{
                    to: docsLink,
                    title: entity.metadata.name,
                    target: '_blank',
                  }}
                  description={truncateDesc(entity.metadata.description, 100)}
                  buttonText={getButtonText(entity.metadata.name)}
                />
              </Box>
            );
          })}
        </HorizontalScrollGrid>
      </div>
    </CardGroup>
  );
};

const priorityDocs = [
  'bc-developer-guide',
  'mobile-developer-guide',
  'platform-developer-docs',
  'public-cloud-techdocs',
];

export const AllDocsContent = () => {
  return (
    <DocsContent
      title="Documentation library"
      icon={<DocsIcon />}
      entityLoader={async (catalogApi: any) => {
        const allEntities = await catalogApi.getEntities();
        const docs = allEntities.items.filter(
          (entity: any) =>
            !!entity.metadata.annotations?.['backstage.io/techdocs-ref'],
        );

        // Surface the 'classic' docs first. Is this actually worth doing?
        docs.sort((a: any, b: any) => {
          const aIdx = priorityDocs.indexOf(a.metadata.name);
          const bIdx = priorityDocs.indexOf(b.metadata.name);
          if (aIdx === -1 && bIdx === -1) return 0;
          if (aIdx === -1) return 1;
          if (bIdx === -1) return -1;

          return aIdx - bIdx;
        });
        return docs;
      }}
    />
  );
};

export const StarredDocsContent = () => {
  const { starredEntities } = useStarredEntities();

  return (
    <DocsContent
      title="Starred documentation"
      icon={<StarIcon />}
      entityLoader={async (catalogApi: any) => {
        if (!starredEntities.size) return [];

        return (
          await catalogApi.getEntitiesByRefs({
            entityRefs: [...starredEntities],
          })
        ).items.filter(
          (e: any) => !!e.metadata.annotations?.['backstage.io/techdocs-ref'],
        );
      }}
    />
  );
};
