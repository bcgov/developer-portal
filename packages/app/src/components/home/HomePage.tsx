import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {styled, useTheme} from '@material-ui/styles';
import {Content, ItemCardGrid, ItemCardHeader, LinkButton, Page} from '@backstage/core-components';
import {Theme} from '@material-ui/core/styles';
import {HomePageSearchBar} from "@backstage/plugin-search";
import {Card, CardActions, CardContent, CardMedia, makeStyles, Typography, Box, Grid, Collapse} from "@material-ui/core";
import {GitHubSvgIcon, RocketChatIcon, StackOverFlowIcon} from "../utils/icons";
import LockIcon from '@material-ui/icons/Lock';
import { Link } from 'react-router-dom';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
	card: {
		color: theme.palette.primary.main,
		display:'flex',
		justiyContent:'space-between',
		flexDirection:'column',
		borderRadius: '1rem',
		boxShadow: 'rgba(0, 0, 0, .1) 0 20px 25px -5px, rgba(0, 0, 0, .04) 0 10px 10px -5px',
	},
	cardDocsHeader: {
		color: theme.palette.primary.main,
		backgroundColor: theme.palette.background.paper,
		backgroundImage: 'none',
		paddingBottom: theme.spacing(1),
	},
	cardEventHeader: {
		color: 'white',
		backgroundColor: theme.palette.primary.main,
		backgroundImage: `linear-gradient(to bottom right, ${theme.palette.primary.main} 30%, rgba(0, 0, 0, .3))`

	},
	cardToolHeader: {
		color: theme.palette.primary.main,
		backgroundColor: theme.palette.background.paper,
		backgroundImage: `linear-gradient(to bottom right, ${theme.palette.background.paper} 30%, rgba(0, 0, 0, .11))`
	},
	cardActions: {
		justifyContent: 'flex-start',
		paddingLeft: '1rem'
	},
	defaultButton: {
		marginTop: 'auto',
		width: 'fit-content',
		borderColor: 'currentcolor',
		borderBottom: '2px solid rgba(0, 0, 0, .2)',
		borderRadius: '0',
		color: theme.palette.primary.main,
		padding: 'calc(0.667em + 4px) 4px calc(0.33em + 4px)',
		boxShadow: 'rgba(0, 0, 0, .1) 0 20px 25px -5px, rgba(0, 0, 0, .04) 0 10px 10px -5px',
	},
	root: {
		padding: 'calc(2.1rem - 24px) 9%',
	},
	cardRecon: {
		color: 'white',
		backgroundColor: theme.palette.primary.main,
		display:'flex',
		justiyContent:'space-between',
		flexDirection:'column',
		borderRadius: '1rem',
		position: 'relative',
		boxShadow: 'rgba(0, 0, 0, .2) 0 20px 25px -5px, rgba(0, 0, 0, .04) 0 10px 10px -5px',
	},
	ReconButton: {
		marginTop: 'auto',
		width: 'fit-content',
		borderColor: 'currentcolor',
		borderBottom: '2px solid rgba(0, 0, 0, .2)',
		borderRadius: '0',
		color: 'white',
		padding: 'calc(0.667em + 4px) 4px calc(0.33em + 4px)',
		boxShadow: 'rgba(0, 0, 0, .1) 0 20px 25px -5px, rgba(0, 0, 0, .14) 0 10px 10px -5px',
	},
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

const GlobalStyle = createGlobalStyle`
	a {
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}`;

interface ExpandMoreProps extends IconButtonProps {
	expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
	const { expand, ...other } = props;
		return <IconButton {...other} />;
	})(({ /*theme,*/ expand }) => ({
		transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
		marginLeft: 'auto',
		// transition: theme.transitions.create('transform', {
		// 	duration: theme.transitions.duration.shortest,
		// }),
	})
);

const HomePage = () => {
	const classes = useStyles();
	const theme: Theme = useTheme();

	const tools = [
		{
			key: 't1',
			url: 'https://stackoverflow.developer.gov.bc.ca',
			label: 'Stack Overflow',
			icon: <StackOverFlowIcon/>,
			buttonText: ['Ask a question', <LockIcon key='t1-icon' style={{ fill: '#606060' }} />],
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

	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
	  setExpanded(!expanded);
	};

	return (
		<Page themeId="home">
			<GlobalStyle />
			<Content>
				<div className={classes.root}>
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
							classes={{ root: classes.searchBar }}
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
										title={<Link style={{color: theme.palette.primary.main}} to="docs/default/component/bcdg">Application development guide</Link>}
									/>
								</CardMedia>
								<CardContent>
									Everything you need to know to build a quality, consistent and compliant application.
								</CardContent>
								<CardActions classes={{ root: classes.cardActions }}>
									<LinkButton to="docs/default/component/bcdg"
										classes={{ root: classes.defaultButton }}
										title="bcdg"
									>Build a quality application</LinkButton>
								</CardActions>
							</Card>
						</Grid>
						<Grid item sm={12} md={4} style={{display: 'flex'}}>
							<Card key='mobile-developer-guide' classes={{ root: classes.card }} >
								<CardMedia>
									<ItemCardHeader classes={{ root: classes.cardDocsHeader }}
										title={<Link style={{color: theme.palette.primary.main}} to="docs/default/component/mobile-developer-guide">Mobile development guide</Link>}
									/>
								</CardMedia>
								<CardContent>
									Detailed guidance on the steps and practices you must follow when developing a mobile application.
								</CardContent>
								<CardActions classes={{ root: classes.cardActions }}>
									<LinkButton to="docs/default/component/mobile-developer-guide"
										classes={{ root: classes.defaultButton }}
										title="mobile-developer-guide"
									>Review the mobile development guide</LinkButton>
								</CardActions>
							</Card>
						</Grid>
						<Grid item sm={12} md={4} style={{display: 'flex'}}>
							<Card key='platform-developer-docs' classes={{ root: classes.card }} >
								<CardMedia>
									<ItemCardHeader classes={{ root: classes.cardDocsHeader }}
										title={<Link style={{color: theme.palette.primary.main}} to="docs/default/component/platform-developer-docs">Private cloud application deployment</Link>}
									/>
								</CardMedia>
								<CardContent>
									Learn how to deploy applications on the private cloud OpenShift environment.
								</CardContent>
								<CardActions classes={{ root: classes.cardActions }}>
									<LinkButton to="docs/default/component/platform-developer-docs"
										classes={{ root: classes.defaultButton }}
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
						<Card key='e1' classes={{ root: classes.card }}>
							<CardMedia>
								<ItemCardHeader
									title={`Application Modernization`}
									subtitle="November 14th"
									classes={{ root: classes.cardEventHeader }}
								/>
							</CardMedia>
							<CardContent>
								<p>
								Attend a special event with experts from AWS, Red Hat, Deloitte, Dynatrace and DXCAS to learn how intelligent observability can accelerate your application modernization.
								</p>
								<br /><b>What: </b> Application Modernization & Intelligent Observability
								<br /><b>Where: </b> Delta Hotels Victoria Ocean Pointe Resort
								<br /><b>When: </b> Tuesday, November 14 · 8am - 3pm PT
							</CardContent>
							<CardActions classes={{ root: classes.cardActions }}>
								<LinkButton to="https://info.dynatrace.com/noram-great-lakes-dh-canada-west-government-day-23061-registration.html" classes={{ root: classes.defaultButton }}>
								Join the event
								</LinkButton>
							</CardActions>
						</Card>
						<Card key='e2' classes={{ root: classes.card }}>
							<CardMedia>
								<ItemCardHeader
									title={`OpenShift 201 Workshop & Lab`}
									subtitle="November 14th"
									classes={{ root: classes.cardEventHeader }}
								/>
							</CardMedia>
							<CardContent>
								<p>
								This two-day training is designed to introduce new skills, and build on knowledge gained during OpenShift 101.
								</p>
								<br /><b>What: </b>The OpenShift 201 course
								<br /><b>Where: </b> Online
								<br /><b>When: </b> Tuesday, November 14 · 9am - 4pm PT
							</CardContent>
							<CardActions classes={{ root: classes.cardActions }}>
								<LinkButton color="primary" to="https://openshift201.eventbrite.com/" classes={{ root: classes.defaultButton }}>
								Register for OpenShift 201
								</LinkButton>
							</CardActions>
						</Card>
						<Card key='e3' classes={{ root: classes.card }}>
							<CardMedia>
								<ItemCardHeader
									title={`OpenShift 101 Workshop & Lab`}
									subtitle="November 21st"
									classes={{ root: classes.cardEventHeader }}
								/>
							</CardMedia>
							<CardContent>
								<p>
								This four-session technical training covers the DevOps platform and application operational tasks.
								</p>
								<br /><b>What: </b>The OpenShift 101 course
								<br /><b>Where: </b>Online
								<br /><b>When: </b>Tuesday, November 21 · 9am - 4pm PT
							</CardContent>
							<CardActions classes={{ root: classes.cardActions }}>
								<LinkButton color="primary" to="https://openshift101.eventbrite.com/" classes={{ root: classes.defaultButton }}>
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
						We're all here to help! Connect with other developers across the B.C. government, ask questions and improve your knowledge.
						</Typography>
					</Box>
					<ItemCardGrid classes={{ root: classes.cardGrid }}>
						{tools.map(t => (
							<Card key={t.key} classes={{ root: classes.card }}>
								<CardMedia>
									<ItemCardHeader
										title={<Box style={{display: 'flex',
													alignItems: 'center',
													flexWrap: 'wrap',
													color: theme.palette.primary.main}}
												>
													{t.icon}&nbsp;&nbsp;{t.label}
												</Box>}
										classes={{ root: classes.cardToolHeader }}
									/>
								</CardMedia>
								<CardContent>
										{t.desc}
								</CardContent>
								<CardActions classes={{ root: classes.cardActions }}>
									<LinkButton color='primary' to={t.url} classes={{ root: classes.defaultButton }}>{t.buttonText}</LinkButton>
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

					<Box sx={{ pb: 4 }}>
						<Card key='truth' classes={{ root: classes.cardRecon }}>
							<CardContent style={{ paddingBottom: 0 }}>
								<Typography variant='body2'>
									The B.C. Public Service acknowledges the territories of First Nations around B.C. and is grateful to carry out our work on these lands.
									We acknowledge the rights, interests, priorities and concerns of all Indigenous Peoples - First Nations, Métis and Inuit - respecting and acknowledging their distinct cultures, histories, rights, laws and governments.
								</Typography>
							</CardContent>
							<CardActions classes={{ root: classes.cardActions }} disableSpacing>
								<ExpandMore
									expand={expanded}
									onClick={handleExpandClick}
									aria-expanded={expanded}
									aria-label="show more"
									>
									<ExpandMoreIcon style={ {fill: 'white' }} />
								</ExpandMore>
							</CardActions>
							<Collapse in={expanded} timeout="auto" unmountOnExit>
								<CardContent style={{ paddingBottom: 0, paddingTop: 0 }}>
									<Typography variant='body2' paragraph>
									The Developer Experience team works from the unceded, ancestral and traditional lands of the:<br/>
									</Typography>
									<Grid container spacing={0} style={{display: 'flex', justifyContent: 'flex-start' }} >
										<Grid item sm={12} md={4}>
											<ul style={{ margin: 0 }}>
												<li><Link to="https://www.esquimaltnation.ca/"><Typography display='inline' variant='body2'>Xwsepsum (Esquimalt)</Typography></Link></li>
												<li><Link to="https://wsanec.com/"><Typography display='inline' variant='body2'>W̱SÁNEĆ</Typography></Link></li>
												<li><Link to="https://malahatnation.com/"><Typography display='inline' variant='body2'>MÁLEXEȽ (Malahat)</Typography></Link></li>
											</ul>
										</Grid>
										<Grid item sm={12} md={4}>
											<ul style={{ margin: 0 }}>
												<li><Link to="https://www.songheesnation.ca/"><Typography display='inline' variant='body2'>Lək̓ʷəŋən (Songhees)</Typography></Link></li>
												<li><Link to="https://www.kwikwetlem.com/"><Typography display='inline' variant='body2'>Kʷikʷəƛ̓əm</Typography></Link></li>
												<li><Link to="https://www.facebook.com/qayqayt/"><Typography display='inline' variant='body2'>Qayqayt</Typography></Link></li>
											</ul>
										</Grid>
										<Grid item sm={12} md={4}>
											<ul style={{ margin: 0 }}>
												<li><Link to="https://beecherbay.ca/"><Typography display='inline' variant='body2'>Sc’ianew (Beecher Bay)</Typography></Link></li>
												<li><Link to="https://www.stolonation.bc.ca/"><Typography display='inline' variant='body2'>S’ólh Téméxw (Stó:lō)</Typography></Link></li>
												<li><Link to="https://twnation.ca/"><Typography display='inline' variant='body2'>Səl̓ilwətaɁɬ Təməxʷ (Tsleil-Waututh)</Typography></Link></li>
											</ul>
										</Grid>
									</Grid>
								</CardContent>
								<CardActions classes={{ root: classes.cardActions }}>
									<LinkButton color='primary' to="https://www2.gov.bc.ca/gov/content/governments/indigenous-people/new-relationship/truth-and-reconciliation-commission-calls-to-action" classes={{ root: classes.ReconButton }}>Learn more about the Calls to Action</LinkButton>
								</CardActions>
							</Collapse>
						</Card>
					</Box>
				</div>
			</Content>
		</Page>
	)
		;
};

export default HomePage;
