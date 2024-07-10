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

interface CardTileProps {
    icon: React.ReactNode,
    linkProps: PropsWithChildren<LinkProps>
};

const CardTitle = ({children, icon, ...props}: PropsWithChildren<CardTileProps>) => {
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
        display: 'flex',
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

const CardButton = (props: PropsWithChildren<LinkProps>) => {
	return (
		<CardLinkButton variant='text'> 
			<Link className="link-text" to={props.to} title={props.title}>{props.children}</Link>
			<ChevronRightIcon className="icon" />
		</CardLinkButton>
	);
};

const useStyles = makeStyles({
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
            background: tokens.surfaceColorMenusHover,
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
        background: tokens.surfaceColorBackgroundLightGray,
    }
});

export const HomePageCards = () => {
    const classes = useStyles();

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
                    <Grid item sm={12} md={4} style={{display: 'flex'}}>
                        <Card key='bcdg' classes={{ root: classes.card }} >
                            <CardMedia>
                                <ItemCardHeader classes={{ root: classes.cardHeader }}
                                    title={<CardTitle linkProps={{ to: "docs/default/component/bcdg", title: "bcdg" }} icon={<DocsIcon />}>Application development guide</CardTitle>}
                                />
                            </CardMedia>
                            <CardContent>
                                Everything you need to know to build a quality, consistent and compliant application.
                            </CardContent>
                            <CardActions>
                                <CardButton to="docs/default/component/bcdg" title="bcdg">Build a quality application</CardButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item sm={12} md={4} style={{display: 'flex'}}>
                        <Card key='mobile-developer-guide' classes={{ root: classes.card }} >
                            <CardMedia>
                                <ItemCardHeader classes={{ root: classes.cardHeader }}
                                    title={<CardTitle linkProps={{ to: "docs/default/component/mobile-developer-guide", title: "mobile-developer-guide" }} icon={<DocsIcon />}>Mobile development guide</CardTitle>}
                                />
                            </CardMedia>
                            <CardContent>
                                Detailed guidance on the steps and practices you must follow when developing a mobile application.
                            </CardContent>
                            <CardActions>
                                <CardButton to="docs/default/component/mobile-developer-guide" title="mobile-developer-guide">Review the mobile guide</CardButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item sm={12} md={4} style={{display: 'flex'}}>
                        <Card key='platform-developer-docs' classes={{ root: classes.card }} >
                            <CardMedia>
                                <ItemCardHeader classes={{ root: classes.cardHeader }}
                                    title={<CardTitle linkProps={{ to: "docs/default/component/platform-developer-docs", title: "platform-developer-docs" }} icon={<DocsIcon />}>Private cloud technical docs</CardTitle>}
                                />
                            </CardMedia>
                            <CardContent>
                            Learn how to build, deploy, maintain, and retire applications on OpenShift.
                            </CardContent>
                            <CardActions>
                                <CardButton to="docs/default/component/platform-developer-docs" title="platform-developer-docs">Explore the Private cloud docs</CardButton>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item sm={12} md={4} style={{display: 'flex'}}>
                        <Card key='public-cloud-techdocs' classes={{ root: classes.card }} >
                            <CardMedia>
                                <ItemCardHeader classes={{ root: classes.cardHeader }}
                                    title={<CardTitle linkProps={{ to: "docs/default/component/public-cloud-techdocs", title: "public-cloud-techdocs" }} icon={<DocsIcon />}>Public cloud technical docs</CardTitle>}
                                />
                            </CardMedia>
                            <CardContent>
                            Learn about building and deploying applications through B.C. government AWS landing zone.
                            </CardContent>
                            <CardActions>
                                <CardButton to="docs/default/component/public-cloud-techdocs" title="public-cloud-techdocs">Explore the Public cloud docs</CardButton>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </div>

            <div className={classes.cardGroup}>
                <BCGovHeaderText variant="h3" paragraph>
                    Events
                </BCGovHeaderText>

                <ItemCardGrid classes={{ root: classes.cardGrid }}>
                    <Card key='e1' classes={{ root: classes.card }}>
                        <CardMedia>
                            <ItemCardHeader classes={{ root: classes.cardHeader }}
                                title={<CardTitle linkProps={{ to: "https://openshift101.eventbrite.com/", title: "OpenShift 101" }} icon={<EventIcon />}>OpenShift 101</CardTitle>}
                            />
                        </CardMedia>
                        <CardContent>
                            <Typography variant='body2' paragraph>This four-session technical training covers the DevOps platform and application operational tasks.</Typography>
                            <Typography variant='body2'><b>What: </b>The OpenShift 101 course</Typography>
                            <Typography variant='body2'><b>Where: </b>Online</Typography>
                            <Typography variant='body2'><b>When: </b>Recurring monthly</Typography>
                        </CardContent>
                        <CardActions>
                            <CardButton to="https://openshift101.eventbrite.com/">Register for OpenShift 101</CardButton>
                        </CardActions>
                    </Card>
                    <Card key='e2' classes={{ root: classes.card }}>
                        <CardMedia>
                            <ItemCardHeader classes={{ root: classes.cardHeader }}
                                title={<CardTitle linkProps={{ to: "https://openshift201.eventbrite.com/", title: "OpenShift 201" }} icon={<EventIcon />}>OpenShift 201</CardTitle>}
                            />
                        </CardMedia>
                        <CardContent>
                            <Typography variant='body2' paragraph>This two-day training is designed to introduce new skills, and build on knowledge gained during OpenShift 101.</Typography>
                            <Typography variant='body2'><b>What: </b>The OpenShift 201 course</Typography>
                            <Typography variant='body2'><b>Where: </b>Online</Typography>
                            <Typography variant='body2'><b>When: </b>Recurring every other month</Typography>
                        </CardContent>
                        <CardActions>
                            <CardButton to="https://openshift201.eventbrite.com/">Register for OpenShift 201</CardButton>
                        </CardActions>
                    </Card>
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
                                    title={<CardTitle linkProps={{ to: t.url, title: t.label }} icon={t.icon}>{t.label}</CardTitle>}
                                />
                            </CardMedia>
                            <CardContent>
                                    {t.desc}
                            </CardContent>
                            <CardActions>
                                <CardButton to={t.url} title={t.label}>{t.buttonText}</CardButton>
                            </CardActions>
                        </Card>
                    ))}
                </ItemCardGrid>
            </div>
        </div>
    );
}