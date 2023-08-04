import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import styled, {createGlobalStyle} from 'styled-components';
import {useTheme} from '@material-ui/styles';
import {LinkButton} from '@backstage/core-components';
import {Theme} from '@material-ui/core/styles';
import {HomePageSearchBar} from "@backstage/plugin-search";
import {makeStyles, Typography} from "@material-ui/core";
import {HomePageToolkit} from "@backstage/plugin-home";
import {GitHubSvgIcon, RocketChatIcon, StackOverFlowIcon} from "../utils/icons";
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
	},
	searchBarOutline: {
		borderStyle: 'none',
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
			border-bottom: 2px solid;
			border-radius: 0;
			color: ${theme.palette.primary.main};
			padding: calc(0.667em + 2px) 0 calc(0.33em + 2px);
			box-shadow: var(--box-shadow);
		}
	`;
	const Container = styled.div`
		box-shadow: var(--box-shadow);
		border-radius: 1rem;
		padding: 1rem;
	`;

	const ContainerH2 = styled.h2`
		color: ${theme.palette.primary.main};
	`;

	const ContainerP = styled.p`
		color: ${theme.palette.primary.main};
	`;

	const ContainerImg = styled.img`
		width: 100%;
	`;

	const tools = [
		{
			url: 'http://https://stackoverflow.developer.gov.bc.ca',
			label: 'Stack Overflow',
			icon: <StackOverFlowIcon/>
		},
		{
			url: 'https://chat.developer.gov.bc.ca',
			label: 'RocketChat',
			icon: <RocketChatIcon/>
		},
		{
			url: 'https://github.com/bcgov',
			label: 'GitHub',
			icon: <GitHubSvgIcon/>
		}
	]

	return (
		<>
			<GlobalStyle/>
			<Box sx={{ pb: 1 }}>
				<Grid container spacing={4} justifyContent='space-between'>
					<Grid item sm={12} md={8}>
						<Typography variant="h2">B.C. Government DevHub</Typography>
					</Grid>
				</Grid>
			</Box>
			<Grid container spacing={0} justifyContent='flex-start'>
				<Grid item xs={12}>
					<Typography paragraph>
						The B.C. Government DevHub is a place for developers and product teams to access common resources, tools, technical documentation and APIs.
					</Typography>
				</Grid>
			</Grid>

			<Box sx={{ pt: 4, pb: 6 }}>
				<HomePageSearchBar
					classes={{root: classes.searchBar}}
					InputProps={{classes: {notchedOutline: classes.searchBarOutline}}}
					placeholder="Search"
				/>
			</Box>

			<Box sx={{ pb: 1 }}>
				<Typography variant="h3">
					Documentation library
				</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid item sm={12} md={4} style={{display: 'flex'}}>
					<Container style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
						<ContainerImg src="" />
						<ContainerH2>
							<Link to="docs/default/component/bcdg">
								Application development guide
							</Link>
						</ContainerH2>
						<ContainerP>Everything you need to know to build a quality, consistent and compliant application for the B.C. government.</ContainerP>
						<LinkButton
							className="default-button"
							title="bcdg"
							to="docs/default/component/bcdg"
						>Read Now</LinkButton>
					</Container>
				</Grid>
				<Grid item sm={12} md={4} style={{display: 'flex'}}>
					<Container style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
					<ContainerImg src="" />
						<ContainerH2>
							<Link to="docs/default/component/mobile-developer-guide">
								Mobile development guide
							</Link>
						</ContainerH2>
						<ContainerP>Detailed guidance on the steps and practices you must follow when developing a mobile application for the B.C. government.</ContainerP>
						<LinkButton
							className="default-button"
							title="mobile"
							to="docs/default/component/mobile-developer-guide"
						>Read Now</LinkButton>
					</Container>
				</Grid>
				<Grid item sm={12} md={4} style={{display: 'flex'}}>
					<Container style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
						<ContainerImg src="" />
						<ContainerH2>
							<Link to="docs/default/component/platform-developer-docs">
								Private cloud application deployment
							</Link>
						</ContainerH2>
						<ContainerP>Learn how to deploy applications on the private cloud OpenShift environment.</ContainerP>
						<LinkButton
							className="default-button"
							title="platform-developer-docs"
							to="docs/default/component/platform-developer-docs"
						>Read Now</LinkButton>
					</Container>
				</Grid>
			</Grid>

			<Box sx={{ pt: 6 }}>
				<Grid item xs={12}>
					<HomePageToolkit
						title="Get support from the developer community"
						tools={tools}
					/>
				</Grid>
			</Box>

			<Box sx={{ pt: 5 }}>
				<Box sx={{ pb: 1 }}>
					<Typography variant="h3">
						Provide feedback
					</Typography>
				</Box>
				<Typography paragraph>
					The B.C. Government DevHub is managed by the Developer Experience team. Join us as we work together to create impactful solutions by <a href='#'>providing feedback</a> or participating in user research.
				</Typography>
			</Box>
		</>
	)
		;
};

export default HomePage;
