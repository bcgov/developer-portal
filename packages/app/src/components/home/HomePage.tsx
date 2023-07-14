import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled, {createGlobalStyle} from 'styled-components';
import {useTheme} from '@material-ui/styles';
import {LinkButton} from '@backstage/core-components';
import {Theme} from '@material-ui/core/styles';
import {HomePageSearchBar} from "@backstage/plugin-search";
import {makeStyles} from "@material-ui/core";
import {HomePageCompanyLogo} from "@backstage/plugin-home";

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

const useLogoStyles = makeStyles(theme => ({
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
	const {container} = useLogoStyles();
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

	return (
		<>
			<GlobalStyle/>
			<Grid container spacing={3}>
				<Grid container item xs={12} justifyContent='center'>
					<HomePageCompanyLogo className={container}/>
					<HomePageSearchBar
						classes={{root: classes.searchBar}}
						InputProps={{classes: {notchedOutline: classes.searchBarOutline}}}
						placeholder="Search"
					/> </Grid>
					<Grid item sm={12} md={4}>
					<Container>
						<ContainerImg
							src="https://digital.gov.bc.ca/wp-content/uploads/2023/03/digitalFrameworkGrey.png"/>
						<ContainerH2>Explore the catalog</ContainerH2>
						<ContainerP>The catalog is where you can discover all of the software that is being developed by team across BC Gov.</ContainerP>
						<LinkButton
							className="default-button"
							title="Catalog"
							to="catalog"
						>Catalog</LinkButton>
					</Container>
				</Grid>
				<Grid item sm={12} md={4}>
					<Container>
						<ContainerImg src="https://digital.gov.bc.ca/wp-content/uploads/2023/04/tools-2.png"/>
						<ContainerH2>Explore the API directory</ContainerH2>
						<ContainerP>The API directory is where you can learn about APIs that have been published by teams across BC Gov</ContainerP>
						<LinkButton
							className="default-button"
							title="APIs"
							to="api-docs"
						>APIs</LinkButton>
					</Container>
				</Grid>
				<Grid item sm={12} md={4}>
					<Container>
						<ContainerImg src="https://digital.gov.bc.ca/wp-content/uploads/2023/03/communityGrey.png"/>
						<ContainerH2>Explore the documentation library</ContainerH2>
						<ContainerP>The docmentation library is where we've collected technical documentation about application development within BC Gov.</ContainerP>
						<LinkButton
							className="default-button"
							title="Docs"
							to="docs"
						>Docs</LinkButton>
					</Container>
				</Grid>
			</Grid>
		</>
	);
};

export default HomePage;
