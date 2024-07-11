import React, { PropsWithChildren } from 'react';
import {ItemCardGrid, ItemCardHeader, LinkProps} from '@backstage/core-components';
import {Card, CardActions, CardContent, CardMedia, makeStyles, Typography, Box, Grid, withStyles, Button} from "@material-ui/core";
import {GitHubSvgIcon, RocketChatIcon, StackOverFlowIcon} from "../utils/icons";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link } from 'react-router-dom';
import DocsIcon from '@material-ui/icons/Description';
import EventIcon from '@material-ui/icons/Event';
import { BCGovHeaderText } from './HomeHeaderText';
import * as tokens from "@bcgov/design-tokens/js";

const CardTitleIcon = withStyles({
    root: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: tokens.layoutMarginSmall,
        '& .icon': {
            paddingTop: tokens.layoutPaddingXsmall,
        }
    },
})(Box);

interface CardTitleProps {
    icon: React.ReactNode,
    linkProps: PropsWithChildren<LinkProps>
};

const CardTitle = ({children, icon, ...props}: PropsWithChildren<CardTitleProps>) => {
    return (
        <CardTitleIcon>
            <div className='icon'>{icon}</div>
            <Link {...props.linkProps}>
                {children}
            </Link>
        </CardTitleIcon>
    );
};

const CardLinkButton = withStyles({
	root: {
        paddingLeft: tokens.layoutPaddingNone,
        '& .link-text': {
            color: tokens.typographyColorLink,
            transition: 'transform .25s ease',
        },
        '& .icon': {
            fill: tokens.typographyColorLink,
            marginLeft: tokens.layoutMarginXsmall,
            transition: 'transform .25s ease',
        },
        '&:hover': {
            background: 'none',
            '& .link-text': {
                textDecoration: 'none',
                color: tokens.themeBlue80,
            },
            '& .icon': {
                transform: 'translateX(6px)',
                fill: tokens.themeBlue80,
            },
        },
	},
})(Button);

const CardButton = ({children, ...props}: PropsWithChildren<LinkProps>) => {
	return (
		<CardLinkButton variant='text'> 
			<Link className="link-text" {...props}>{children}</Link>
			<ChevronRightIcon className="icon" />
		</CardLinkButton>
	);
};

const useStyles = makeStyles((theme) => ({
    cardGroup: {
        paddingTop: tokens.layoutMarginXxxlarge,
    },
    cardGrid: {
        gridTemplateColumns: 'repeat(auto-fit)',
        gridGap: tokens.layoutMarginXlarge,
	},
    card: {
        display: 'flex',
        flex: 1,
        justifyContent:'space-between',
        flexDirection:'column',
        '&:hover': {
            background: (theme.palette.type === 'dark')? tokens.themeGray80 : tokens.surfaceColorMenusHover,
        }
    },
    cardHeader: {
        backgroundImage: 'none',
        paddingBottom: tokens.layoutPaddingNone,
    },
    background: {
        width: 'auto',
        padding: `0px calc(9% + ${tokens.layoutPaddingLarge}) ${tokens.layoutMarginXxxlarge}`,
        marginLeft: `-${tokens.layoutMarginLarge}`,
        marginRight: `-${tokens.layoutMarginLarge}`,
        background: (theme.palette.type === 'dark')? tokens.themeGray90: tokens.surfaceColorBackgroundLightGray,
    }
}));

export const HomePageCards = () => {
    const classes = useStyles();

    const docs = [
		{
			key: 'd1',
			url: 'docs/default/component/bcdg',
			label: 'Application development guide',
			icon: <DocsIcon />,
			buttonText: 'Build a quality application',
			desc: 'Everything you need to know to build a quality, consistent and compliant application.'
		},
		{
			key: 'd2',
			url: 'docs/default/component/mobile-developer-guide',
			label: 'Mobile development guide',
			icon: <DocsIcon />,
			buttonText: 'Review the mobile guide',
			desc: 'Detailed guidance on the steps and practices you must follow when developing a mobile application.'
		},
		{
			key: 'd3',
			url: 'docs/default/component/platform-developer-docs',
			label: 'Private cloud technical docs',
			icon: <DocsIcon />,
			buttonText: 'Explore the Private cloud docs',
			desc: 'Learn how to build, deploy, maintain, and retire applications on OpenShift.'
		},
        {
			key: 'd4',
			url: 'docs/default/component/public-cloud-techdocs',
			label: 'Public cloud technical docs',
			icon: <DocsIcon />,
			buttonText: 'Explore the Public cloud docs',
			desc: 'Learn about building and deploying applications through B.C. government AWS landing zone.'
		}
	]

    const events = [
		{
			key: 'e1',
			url: 'https://openshift101.eventbrite.com/',
			label: 'OpenShift 101',
			icon: <EventIcon />,
			buttonText: 'Register for OpenShift 101',
			desc: <>
                    <Typography variant='body2' paragraph>This four-session technical training covers the DevOps platform and application operational tasks.</Typography>
                    <Typography variant='body2'><b>What: </b>The OpenShift 101 course</Typography>
                    <Typography variant='body2'><b>Where: </b>Online</Typography>
                    <Typography variant='body2'><b>When: </b>Recurring monthly</Typography>
                </>
		},
		{
			key: 'e2',
			url: 'https://openshift201.eventbrite.com/',
			label: 'OpenShift 201',
			icon: <EventIcon />,
			buttonText: 'Register for OpenShift 201',
			desc: <>
                    <Typography variant='body2' paragraph>This two-day training is designed to introduce new skills, and build on knowledge gained during OpenShift 101.</Typography>
                    <Typography variant='body2'><b>What: </b>The OpenShift 201 course</Typography>
                    <Typography variant='body2'><b>Where: </b>Online</Typography>
                    <Typography variant='body2'><b>When: </b>Recurring every other month</Typography>
                </>
		},
    ]

    const tools = [
		{
			key: 't1',
			url: 'https://stackoverflow.developer.gov.bc.ca',
			label: 'Stack Overflow',
			icon: <StackOverFlowIcon/>,
			buttonText: 'Ask a question',
			desc: 'Ask, answer and discuss technical questions specific to the B.C. government on the popular Q & A platform.'
		},
		{
			key: 't2',
			url: 'https://chat.developer.gov.bc.ca',
			label: 'RocketChat',
			icon: <RocketChatIcon/>,
			buttonText: 'Message teams',
			desc: 'Connect on an open-source team communication app that offers real-time chat, file sharing and collaboration features.'
		},
		{
			key: 't3',
			url: 'https://github.com/bcgov',
			label: 'GitHub',
			icon: <GitHubSvgIcon/>,
			buttonText: 'Find code',
			desc: 'Work together on a web-based version control platform that enables developers to host, review and manage code repositories.'
		}
	]

    return (
        <div className={classes.background}>
            <div className={classes.cardGroup}>
                <Grid container spacing={1} justifyContent="space-between">
                    <BCGovHeaderText variant="h3" paragraph>
                        Documentation library
                    </BCGovHeaderText>
                    <CardButton to="docs">View all docs</CardButton>
                </Grid>

                <Grid container spacing={4}>
                    {docs.map(d => (
                        <Grid item sm={12} md={4} style={{display: 'flex'}}>
                            <Card key={d.key} classes={{ root: classes.card }}>
                                <CardMedia>
                                    <ItemCardHeader classes={{ root: classes.cardHeader }}
                                        title={<CardTitle linkProps={{ to: d.url, title: d.label }} icon={d.icon}>{d.label}</CardTitle>}
                                    />
                                </CardMedia>
                                <CardContent>
                                    {d.desc}
                                </CardContent>
                                <CardActions>
                                    <CardButton to={d.url} title={d.label}>{d.buttonText}</CardButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>

            <div className={classes.cardGroup}>
                <BCGovHeaderText variant="h3" paragraph>
                    Events
                </BCGovHeaderText>

                <ItemCardGrid classes={{ root: classes.cardGrid }}>
                    {events.map(e => (
                        <Card key={e.key} classes={{ root: classes.card }}>
                            <CardMedia>
                                <ItemCardHeader classes={{ root: classes.cardHeader }}
                                    title={<CardTitle linkProps={{ to: e.url, title: e.label, target: '_blank' }} icon={e.icon}>{e.label}</CardTitle>}
                                />
                            </CardMedia>
                            <CardContent>
                                {e.desc}
                            </CardContent>
                            <CardActions>
                                <CardButton to={e.url} title={e.label} target="_blank">{e.buttonText}</CardButton>
                            </CardActions>
                        </Card>
                    ))}
                </ItemCardGrid>
            </div>

            <div className={classes.cardGroup}>
                <BCGovHeaderText variant="h3" gutterBottom>
                Get support from the developer community
                </BCGovHeaderText>
                <Typography paragraph>
                We're all here to help! Connect with other developers across the B.C. government, ask questions and improve your knowledge.
                </Typography>

                <ItemCardGrid classes={{ root: classes.cardGrid }}>
                    {tools.map(t => (
                        <Card key={t.key} classes={{ root: classes.card }}>
                            <CardMedia>
                                <ItemCardHeader classes={{ root: classes.cardHeader }}
                                    title={<CardTitle linkProps={{ to: t.url, title: t.label, target: '_blank' }} icon={t.icon}>{t.label}</CardTitle>}
                                />
                            </CardMedia>
                            <CardContent>
                                {t.desc}
                            </CardContent>
                            <CardActions>
                                <CardButton to={t.url} title={t.label} target="_blank">{t.buttonText}</CardButton>
                            </CardActions>
                        </Card>
                    ))}
                </ItemCardGrid>
            </div>
        </div>
    );
}