import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled, { createGlobalStyle } from 'styled-components';
import { useTheme } from '@material-ui/styles';
import { LinkButton } from '@backstage/core-components';
import { Theme } from '@material-ui/core/styles';

const HomePage = () => {
	const theme: Theme = useTheme();

	const GlobalStyle = createGlobalStyle`
		:root {
			--box-shadow: rgba(0,0,0,.1) 0 20px 25px -5px,rgba(0,0,0,.04) 0 10px 10px -5px;
		}
		body {
			padding: 1rem 3rem;
		}
		.default-button {
			border-color: currentcolor;
			border-bottom: 2px solid;
			border-radius: 0;
			color: ${ theme.palette.primary.main };
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
		color: ${ theme.palette.primary.main };
	`;

	const ContainerP = styled.p`
		color: ${ theme.palette.primary.main };
	`;

	const ContainerImg = styled.img`
		width: 100%;
	`;

	return (
		<>
			<GlobalStyle />
			<h1>BCDevExchange Headline</h1>
			<Grid container spacing={3}>
				<Grid item sm={12} md={4}>
					<Container>
						<ContainerImg src="https://digital.gov.bc.ca/wp-content/uploads/2023/03/digitalFrameworkGrey.png" />
						<ContainerH2>Box Headline 1</ContainerH2>
						<ContainerP>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis mollis, est non commodo luctus, nisi.</ContainerP>
						<LinkButton
							className="default-button"
							title="Catalog"
							to="catalog?filters[kind]=all"
							>Catalog</LinkButton>
					</Container>
				</Grid>
				<Grid item sm={12} md={4}>
					<Container>
					<ContainerImg src="https://digital.gov.bc.ca/wp-content/uploads/2023/04/tools-2.png" />
						<ContainerH2>Box Headline 2</ContainerH2>
						<ContainerP>Maecenas sed diam eget risus varius blandit sit amet non magna. Morbi leo risus, porta ac consectetur ac.</ContainerP>
						<LinkButton
							className="default-button"
							title="APIs"
							to="catalog?filters[kind]=api"
							>APIs</LinkButton>
					</Container>
				</Grid>
				<Grid item sm={12} md={4}>
					<Container>
					<ContainerImg src="https://digital.gov.bc.ca/wp-content/uploads/2023/03/communityGrey.png" />
						<ContainerH2>Box Headline 3</ContainerH2>
						<ContainerP>Cras mattis consectetur purus sit amet fermentum. Nullam id dolor id nibh ultricies vehicula ut id elit.</ContainerP>
						<LinkButton
							className="default-button"
							title="Docs"
							to="docs?filters[kind]=all"
							>Docs</LinkButton>
					</Container>
				</Grid>
			</Grid>
		</>
	);
};

export default HomePage;
