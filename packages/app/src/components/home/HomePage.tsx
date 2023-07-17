import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled, {createGlobalStyle} from 'styled-components';
import {useTheme} from '@material-ui/styles';
import {LinkButton} from '@backstage/core-components';
import {Theme} from '@material-ui/core/styles';
import {HomePageSearchBar} from "@backstage/plugin-search";
import {makeStyles, Typography} from "@material-ui/core";
import {HomePageToolkit, TemplateBackstageLogoIcon} from "@backstage/plugin-home";

const useStyles = makeStyles(theme => ({
	searchBar: {
		display: 'flex',
		maxWidth: '60vw',
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
			padding: 1rem 3rem;
		}

		.default-button {
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
			icon: <TemplateBackstageLogoIcon/>
		},
		{
			url: 'https://chat.developer.gov.bc.ca',
			label: 'RocketChat',
			icon: <TemplateBackstageLogoIcon/>
		},
		{
			url: 'https://github.com/bcogv',
			label: 'GitHub',
			icon: <TemplateBackstageLogoIcon/>
		}
	]

	return (
		<>
			<GlobalStyle/>
			<Grid container spacing={3} justifyContent='space-between'>
				<Grid item sm={12} md={8}>
					<Typography variant="h2">BC government developer portal</Typography>
				</Grid>
				<Grid item sm={12} md={4}>
					<HomePageSearchBar
						classes={{root: classes.searchBar}}
						InputProps={{classes: {notchedOutline: classes.searchBarOutline}}}
						placeholder="Search"
					/> </Grid>
			</Grid>
			<Grid container spacing={3} justifyContent='flex-start'>
				<Grid item xs={12}>
					<Typography paragraph>
						Explore our centralized hub to access common resources, tools, documentation and API’s that
						enable
						applications and services for the benefit of the developer community. Join us on this journey as
						we
						work
						together to create impactful solutions for people.
					</Typography>
					<Typography paragraph>
						The developer portal is a product of the BC Government Developer Experience team. Help us
						improve
						this
						portal and our other services and tools by <a
						href="https://github.com/bcgov/developer-portal/issues">providing
						feedback</a> or <a
						href="mailto:developer.experience@gov.bc.ca?subject=Developer portal user research">volunteering</a> to
						participating in user research.
					</Typography>
				</Grid>
			</Grid>

			<Grid item sm={12}>
				<Typography variant="h3">
					Documentation library
				</Typography>
			</Grid>
			<Grid container spacing={3}>
				<Grid item sm={12} md={4}>
					<Container>
						<ContainerImg
							src="https://digital.gov.bc.ca/wp-content/uploads/2023/03/digitalFrameworkGrey.png"/>
						<ContainerH2>Get started with mobile development.</ContainerH2>
						<ContainerP>The BC Mobile Developer Guide provides guidance to developers on steps and practices
							to
							follow for developing mobile application for the BC government as well as the supports
							available to
							them.</ContainerP>
						<LinkButton
							className="default-button"
							title="mobile"
							to="docs/default/component/mobile-developer-guide"
						>Read Now</LinkButton>
					</Container>
				</Grid>
				<Grid item sm={12} md={4}>
					<Container>
						<ContainerImg src="https://digital.gov.bc.ca/wp-content/uploads/2023/04/tools-2.png"/>
						<ContainerH2>Get up to speed on application development.</ContainerH2>
						<ContainerP>The BC Developer Guide covers everything developers need to know in order to build
							quality,
							consistent, and compliant applications for the BC government as well as the supports
							available to
							them.</ContainerP>
						<LinkButton
							className="default-button"
							title="bcdg"
							to="docs/default/component/bcdg"
						>Read Now</LinkButton>
					</Container>
				</Grid>
				<Grid item sm={12} md={4}>
					<Container>
						<ContainerImg src="https://digital.gov.bc.ca/wp-content/uploads/2023/03/communityGrey.png"/>
						<ContainerH2>Find out about deploying applications in BC Government's private
							cloud.</ContainerH2>
						<ContainerP>The Private Cloud Technical Documentation describes the services avaialable within
							BC
							government OpenShift environments, as well as recommendations on making the most of
							them.</ContainerP>
						<LinkButton
							className="default-button"
							title="platform-developer-docs"
							to="docs/default/component/platform-developer-docs"
						>Read Now</LinkButton>
					</Container>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<HomePageToolkit title="Community Tools"
								 tools={tools}
				/>
			</Grid>

		</>
	)
		;
};

export default HomePage;
