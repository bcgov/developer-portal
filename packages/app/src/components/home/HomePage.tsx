import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {createGlobalStyle} from 'styled-components';
import {useTheme} from '@material-ui/styles';
import {ItemCardGrid, ItemCardHeader, LinkButton} from '@backstage/core-components';
import {Theme} from '@material-ui/core/styles';
import {HomePageSearchBar} from "@backstage/plugin-search";
import {Card, CardActions, CardContent, CardMedia, makeStyles, Typography} from "@material-ui/core";
import {GitHubSvgIcon, RocketChatIcon, StackOverFlowIcon} from "../utils/icons";
import LockIcon from '@material-ui/icons/Lock';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	searchBar: {
		display: 'flex',
		width: '65%',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[1],
		padding: '8px 0',
		borderRadius: '50px',
		margin: 'auto',
		border: '1px solid #606060',
	},
	searchBarOutline: {
		borderStyle: 'none',
	},
	cardGrid: {
		gridTemplateColumns: 'repeat(auto-fill)',
		gridGap: theme.spacing(3),
	},
	cardEventHeader: {
		color: 'white',
		backgroundColor: '#0E3468',
		backgroundImage: 'none',
	},
	card: {
		color: theme.palette.primary.main,
		display:'flex',
		justiyContent:'space-between',
		flexDirection:'column',
		borderRadius: '1rem',
		boxShadow: 'rgba(0, 0, 0, .1) 0 20px 25px -5px, rgba(0, 0, 0, .04) 0 10px 10px -5px',
	},
	cardToolGrid: {
		gridTemplateColumns: 'repeat(auto-fill)',
		gridGap: theme.spacing(3),
	},
	cardToolHeader: {
		color: 'black',
		backgroundColor: theme.palette.background.paper,
		backgroundImage: `linear-gradient(to bottom right, ${theme.palette.background.paper} 30%, rgba(0, 0, 0, .11))`
	},
	cardDocsHeader: {
		color: theme.palette.primary.main,
		backgroundColor: theme.palette.background.paper,
		backgroundImage: 'none'
	},
	cardActions: {
		justifyContent: 'flex-start',
		padding: '1rem'
	}
}));
makeStyles(theme => ({
	container: {
		margin: theme.spacing(5, 0),
	},
	svg: {
		width: 'auto',
		height: 100,
	},
	path: {
		fill: '#7df3e1',
	},
}));

const HomePage = () => {
	const classes = useStyles();
	const theme: Theme = useTheme();


	const GlobalStyle = createGlobalStyle`
		:root {
			--box-shadow: rgba(0, 0, 0, .1) 0 20px 25px -5px, rgba(0, 0, 0, .04) 0 10px 10px -5px;
		}

		body {
			padding: 2.1rem 9%;
		}

		a {
			text-decoration: none;
		}

		a:hover {
			text-decoration: underline;
		}

		.default-button {
			margin-top: auto;
			width: fit-content;
			border-color: currentcolor;
			border-bottom: 2px solid rgba(0, 0, 0, .2);
			border-radius: 0;
			color: ${theme.palette.primary.main};
			padding: calc(0.667em + 4px) 4px calc(0.33em + 4px);
			box-shadow: var(--box-shadow);
		}`;

	const tools = [
		{
			url: 'https://stackoverflow.developer.gov.bc.ca',
			label: 'Stack Overflow',
			icon: <StackOverFlowIcon/>,
			buttonText: ['Ask a question', <LockIcon style={{ fill: '#606060' }} />],
			desc: 'Ask, answer, and discuss technical questions on our own BC government instance of the popular Q & A platform.'
		},
		{
			url: 'https://chat.developer.gov.bc.ca',
			label: 'RocketChat',
			icon: <RocketChatIcon/>,
			buttonText: 'Message teams',
			desc: 'Connect on an open-source team communication app that offers real-time chat, file sharing, and collaboration features.'
		},
		{
			url: 'https://github.com/bcgov',
			label: 'GitHub',
			icon: <GitHubSvgIcon/>,
			buttonText: 'Find code',
			desc: 'Work together on a web-based version control platform that enables developers to host, review, and manage code repositories.'
		}
	]

	return (
		<>
			<GlobalStyle/>
			<Box sx={{ pb: 1 }}>
				<Grid container spacing={4} justifyContent='space-between'>
					<Grid item sm={12} md={8}>
						<Typography variant="h2">B.C. government DevHub</Typography>
					</Grid>
				</Grid>
			</Box>
			<Grid container spacing={0} justifyContent='flex-start'>
				<Grid item xs={12}>
					<Typography paragraph>
						The B.C. government DevHub is a place for developers and product teams to access common resources, tools, technical documentation and APIs.
					</Typography>
				</Grid>
			</Grid>

			<Box sx={{ pt: 4, pb: 6 }}>
				<HomePageSearchBar
					classes={{root: classes.searchBar}}
					InputProps={{classes: {notchedOutline: classes.searchBarOutline}}}
					placeholder="Search our catalog, including technical documentation and Stack Overflow answers"
				/>
			</Box>

			<Box sx={{ pb: 1 }}>
				<Typography variant="h3">
					Documentation library
				</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid item sm={12} md={4} style={{display: 'flex'}}>
					<Card key='bcdg' classes={{ root: classes.card }} >
						<CardMedia>
							<ItemCardHeader classes={{ root: classes.cardDocsHeader }} 
								children={<Link to="docs/default/component/bcdg"><Typography variant='h5'>Application development guide</Typography></Link>} 
							/>
						</CardMedia>
						<CardContent>
							<Typography paragraph>
							Everything you need to know to build a quality, consistent and compliant application.
							</Typography>
						</CardContent>
						<CardActions classes={{ root: classes.cardActions }}>
							<LinkButton to="docs/default/component/bcdg"
								className="default-button"
								title="bcdg"
							>Build a quality application</LinkButton>
						</CardActions>
					</Card>
				</Grid>
				<Grid item sm={12} md={4} style={{display: 'flex'}}>
					<Card key='mobile-developer-guide' classes={{ root: classes.card }} >
						<CardMedia>
							<ItemCardHeader classes={{ root: classes.cardDocsHeader }} 
								children={<Link to="docs/default/component/mobile-developer-guide"><Typography variant='h5'>Mobile development guide</Typography></Link>} 
							/>
						</CardMedia>
						<CardContent>
							<Typography paragraph>
							Detailed guidance on the steps and practices you must follow when developing a mobile application.
							</Typography>
						</CardContent>
						<CardActions classes={{ root: classes.cardActions }}>
							<LinkButton to="docs/default/component/mobile-developer-guide"
								className="default-button"
								title="mobile-developer-guide"
							>Review the mobile development guide</LinkButton>
						</CardActions>
					</Card>
				</Grid>
				<Grid item sm={12} md={4} style={{display: 'flex'}}>
					<Card key='platform-developer-docs' classes={{ root: classes.card }} >
						<CardMedia>
							<ItemCardHeader classes={{ root: classes.cardDocsHeader }} 
								children={<Link to="docs/default/component/platform-developer-docs"><Typography variant='h5'>Private cloud application deployment</Typography></Link>} 
							/>
						</CardMedia>
						<CardContent>
							<Typography paragraph>
							Learn how to deploy applications on the private cloud OpenShift environment.
							</Typography>
						</CardContent>
						<CardActions classes={{ root: classes.cardActions }}>
							<LinkButton to="docs/default/component/platform-developer-docs"
								className="default-button"
								title="platform-developer-docs"
							>Get ready to deploy</LinkButton>
						</CardActions>
					</Card>
				</Grid>
			</Grid>

			<Box sx={{ pt: 6, pb: 1 }}>
				<Typography variant="h3">
					Events
				</Typography>
			</Box>
			<ItemCardGrid classes={{ root: classes.cardGrid }}>
				<Card key='1' classes={{ root: classes.card }}>
					<CardMedia>
						<ItemCardHeader
							title={`Application Modernization`}
							subtitle="November 14th"
							classes={{ root: classes.cardEventHeader }}
						/>
					</CardMedia>
					<CardContent>
						<Typography paragraph>
						Attend a special event with experts from AWS, Red Hat, Deloitte, Dynatrace and DXCAS to learn how intelligent observability can accelerate your application modernization.
						</Typography>
						<Typography paragraph>
						<br /><b>What: </b> Application Modernization & Intelligent Observability
						<br /><b>Where: </b> Delta Hotels Victoria Ocean Pointe Resort 
						<br /><b>When: </b> Tuesday, November 14 · 8am - 3pm PT
						</Typography>
					</CardContent>
					<CardActions classes={{ root: classes.cardActions }}>
						<LinkButton to="https://info.dynatrace.com/noram-great-lakes-dh-canada-west-government-day-23061-registration.html" className="default-button">
						Join the event
						</LinkButton>
					</CardActions>
				</Card>
				<Card key='2' classes={{ root: classes.card }}>
					<CardMedia>
						<ItemCardHeader
							title={`OpenShift 201 Workshop & Lab`}
							subtitle="November 14th"
							classes={{ root: classes.cardEventHeader }}
						/>
					</CardMedia>
					<CardContent>
						<Typography paragraph>
						This two-day training is designed to introduce new skills, and build on knowledge gained during OpenShift 101.
						</Typography>
						<Typography paragraph>
						<br /><b>What: </b>The OpenShift 201 course
						<br /><b>Where: </b> Online 
						<br /><b>When: </b> Tuesday, November 14 · 9am - 4pm PT
						</Typography>
					</CardContent>
					<CardActions classes={{ root: classes.cardActions }}>
						<LinkButton color="primary" to="https://openshift201.eventbrite.com/" className="default-button">
						Register for OpenShift 201
						</LinkButton>
					</CardActions>
				</Card>
				<Card key='3' classes={{ root: classes.card }}>
					<CardMedia>
						<ItemCardHeader
							title={`OpenShift 101 Workshop & Lab`}
							subtitle="November 21st"
							classes={{ root: classes.cardEventHeader }}
						/>
					</CardMedia>
					<CardContent>
						<Typography paragraph>
						This four-session technical training covers the DevOps platform and application operational tasks.
						</Typography>
						<Typography paragraph>
						<br /><b>What: </b>The OpenShift 101 course
						<br /><b>Where: </b>Online 
						<br /><b>When: </b>Tuesday, November 21 · 9am - 4pm PT
						</Typography>
					</CardContent>
					<CardActions classes={{ root: classes.cardActions }}>
						<LinkButton color="primary" to="https://openshift101.eventbrite.com/" className="default-button">
						Register for OpenShift 101
						</LinkButton>
					</CardActions>
				</Card>
			</ItemCardGrid>

			<Box sx={{ pt: 6, pb: 1 }}>
				<Typography variant="h3" gutterBottom>
				Get support from the developer community
				</Typography>
				<Typography paragraph>
				We're all here to help! Connect with other developers across the BC government, ask questions, and improve your knowledge.
				</Typography>
			</Box>
			<ItemCardGrid classes={{ root: classes.cardToolGrid }}>
				{tools.map(t => (
					<Card key={t.label} classes={{ root: classes.card }}>
						<CardMedia>
							<ItemCardHeader
								title={<Box style={{display: 'flex',
											alignItems: 'center',
											flexWrap: 'wrap',
											color: 'black'}}
										>
											{t.icon}&nbsp;&nbsp;{t.label}
										</Box>}
								classes={{ root: classes.cardToolHeader }}
							/>
						</CardMedia>
						<CardContent>
							<Typography paragraph>
								{t.desc}
							</Typography>
						</CardContent>
						<CardActions classes={{ root: classes.cardActions }}>
							<LinkButton color='primary' to={t.url} className="default-button">{t.buttonText}</LinkButton>
						</CardActions>
					</Card>
				))}
			</ItemCardGrid>

			<Box sx={{ pt: 5, pb: 4 }}>
				<Box sx={{ pb: 1 }}>
					<Typography variant="h3">
						Provide feedback
					</Typography>
				</Box>
				<Typography paragraph>
					The B.C. government DevHub is managed by the Developer Experience team. Join us as we work together to create impactful solutions by <Link style={{ textDecoration: 'underline' }} to='mailto:developer.experience@gov.bc.ca'>providing feedback</Link> or participating in user research.
				</Typography>
			</Box>
		</>
	)
		;
};

export default HomePage;
