import { ItemCardGrid } from '@backstage/core-components';
import { makeStyles, Typography } from '@material-ui/core';
import {
  GitHubSvgIcon,
  RocketChatIcon,
  StackOverFlowIcon,
} from '../utils/icons';
import EventIcon from '@material-ui/icons/Event';
import { BCGovHeaderText } from './HomeHeaderText';
import * as tokens from '@bcgov/design-tokens/js';
import { AllDocsContent, StarredDocsContent } from './HomePageStarredDocs';
import { CardGroup, HomeInfoCard } from './CardComponents';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    gridTemplateColumns: 'repeat(auto-fit)',
    gridGap: tokens.layoutMarginXlarge,
  },
  background: {
    padding: `0px calc(9% + ${tokens.layoutPaddingLarge}) ${tokens.layoutMarginXxxlarge}`,
    marginLeft: `-${tokens.layoutMarginLarge}`,
    marginRight: `-${tokens.layoutMarginLarge}`,
    background:
      theme.palette.type === 'dark'
        ? tokens.themeGray90
        : tokens.surfaceColorBackgroundLightGray,
  },
}));

export const HomePageCards = () => {
  const classes = useStyles();

  const events = [
    {
      key: 'e1',
      url: 'https://openshift101.eventbrite.com/',
      label: 'OpenShift 101',
      icon: <EventIcon />,
      buttonText: 'Register for OpenShift 101',
      desc: (
        <>
          <Typography variant="body2" paragraph>
            This four-session technical training covers the DevOps platform and
            application operational tasks.
          </Typography>
          <Typography variant="body2">
            <b>What: </b>The OpenShift 101 course
          </Typography>
          <Typography variant="body2">
            <b>Where: </b>Online
          </Typography>
          <Typography variant="body2">
            <b>When: </b>Recurring monthly
          </Typography>
        </>
      ),
    },
    {
      key: 'e2',
      url: 'https://openshift201.eventbrite.com/',
      label: 'OpenShift 201',
      icon: <EventIcon />,
      buttonText: 'Register for OpenShift 201',
      desc: (
        <>
          <Typography variant="body2" paragraph>
            This two-day training is designed to introduce new skills, and build
            on knowledge gained during OpenShift 101.
          </Typography>
          <Typography variant="body2">
            <b>What: </b>The OpenShift 201 course
          </Typography>
          <Typography variant="body2">
            <b>Where: </b>Online
          </Typography>
          <Typography variant="body2">
            <b>When: </b>Recurring every other month
          </Typography>
        </>
      ),
    },
  ];

  const tools = [
    {
      key: 't1',
      url: 'https://stackoverflow.developer.gov.bc.ca',
      label: 'Stack Overflow',
      icon: <StackOverFlowIcon />,
      buttonText: 'Ask a question',
      desc: 'Ask, answer and discuss technical questions specific to the B.C. government on the popular Q & A platform.',
    },
    {
      key: 't2',
      url: 'https://chat.developer.gov.bc.ca',
      label: 'RocketChat',
      icon: <RocketChatIcon />,
      buttonText: 'Message teams',
      desc: 'Connect on an open-source team communication app that offers real-time chat, file sharing and collaboration features.',
    },
    {
      key: 't3',
      url: 'https://github.com/bcgov',
      label: 'GitHub',
      icon: <GitHubSvgIcon />,
      buttonText: 'Find code',
      desc: 'Work together on a web-based version control platform that enables developers to host, review and manage code repositories.',
    },
  ];

  return (
    <div className={classes.background}>
      <StarredDocsContent />

      <AllDocsContent />

      <CardGroup>
        <BCGovHeaderText variant="h3" paragraph>
          Events
        </BCGovHeaderText>

        <ItemCardGrid classes={{ root: classes.cardGrid }}>
          {events.map(e => (
            <HomeInfoCard
              key={e.key}
              icon={<EventIcon />}
              title={e.label}
              linkProps={{ to: e.url, title: e.label }}
              description={e.desc}
              buttonText={e.buttonText}
            />
          ))}
        </ItemCardGrid>
      </CardGroup>

      {/* slightly weird text format change when scroll grid is used?!?! */}
      <CardGroup>
        <BCGovHeaderText variant="h3" gutterBottom>
          Get support from the developer community
        </BCGovHeaderText>
        <Typography paragraph>
          We're all here to help! Connect with other developers across the B.C.
          government, ask questions and improve your knowledge.
        </Typography>

        <ItemCardGrid classes={{ root: classes.cardGrid }}>
          {tools.map(t => (
            <HomeInfoCard
              key={t.key}
              icon={t.icon}
              title={t.label}
              linkProps={{ to: t.url, title: t.label }}
              description={t.desc}
              buttonText={t.buttonText}
            />
          ))}
        </ItemCardGrid>
      </CardGroup>
    </div>
  );
};
