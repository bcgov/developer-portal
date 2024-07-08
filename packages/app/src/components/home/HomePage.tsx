import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {Content, Page} from '@backstage/core-components';
import {HomePageSearchBar} from "@backstage/plugin-search";
import {makeStyles, Typography, Box} from "@material-ui/core";
import { Link } from 'react-router-dom';
import { BCGovBannerText, BCGovHeaderText } from './HomeHeaderText';
import { HomePageCards } from './HomePageCards';
import * as tokens from "@bcgov/design-tokens/js";

const useStyles = makeStyles({
	searchBar: {
		display: 'flex',
		width: '65%',
		boxShadow: tokens.surfaceShadowSmall,
		padding: `${tokens.layoutPaddingSmall} 0`,
		borderRadius: '50px',
		margin: `${tokens.layoutMarginXlarge} auto`,
		border: `${tokens.layoutBorderWidthSmall} solid ${tokens.themeGray80}`,
		'@media (max-width: 700px)': {
			width: '90%',
		}
	},
	searchBarOutline: {
		borderStyle: 'none',
	},
	root: {
		padding: `calc(2.1rem - ${tokens.layoutPaddingLarge}) 9% ${tokens.layoutPaddingNone}`,
	},
	feedback: {
		padding: `${tokens.layoutMarginXxxlarge} 9%`,
	},
	cardRecon: {
		color: tokens.typographyColorPrimaryInvert,
		backgroundColor: tokens.themeGray100,
		padding: `${tokens.layoutPaddingXlarge} 9%`,
	},
	footer: {
		width: 'auto',
		marginLeft: `-${tokens.layoutMarginLarge}`,
		marginRight: `-${tokens.layoutMarginLarge}`,
		marginBottom: tokens.layoutMarginXxxlarge,
		borderTop: `${tokens.layoutBorderWidthLarge} solid ${tokens.themePrimaryGold}`,
		borderBottom: `${tokens.layoutBorderWidthLarge} solid ${tokens.themePrimaryGold}`,
	}
});
makeStyles({
	svg: {
		width: 'auto',
		height: 100,
	},
	path: {
		fill: '#7df3e1',
	},
});

const GlobalStyle = createGlobalStyle`
	a {
		text-decoration: none;
		color: ${tokens.typographyColorLink};
	}

	a:hover {
		text-decoration: underline;
	}`;

const HomePage = () => {
	const classes = useStyles();

	return (
		<Page themeId="home">
			<GlobalStyle />
			<Content>
				<div className={classes.root}>
					<BCGovBannerText variant="h2" gutterBottom>B.C. government DevHub</BCGovBannerText>
					<Typography>
						The B.C. government DevHub is a place to access common technical documentation, community knowledge bases, code samples and APIs.
					</Typography>

					<HomePageSearchBar
						classes={{ root: classes.searchBar }}
						InputProps={{classes: {notchedOutline: classes.searchBarOutline}}}
						placeholder="Search all DevHub resources"
					/>
				</div>

				<HomePageCards />

				<div className={classes.feedback}>
					<BCGovHeaderText variant="h3" paragraph>
						Provide feedback
					</BCGovHeaderText>
					<Typography>
						The B.C. government DevHub is managed by the Developer Experience team. Join us as we work together to create impactful solutions by <Link style={{ textDecoration: 'underline' }} to='mailto:developer.experience@gov.bc.ca'>providing feedback</Link> or participating in user research.
					</Typography>
				</div>

				<Box className={classes.footer}>
					<div className={classes.cardRecon}>
						<Typography variant='body2'>
							The B.C. Public Service acknowledges the territories of First Nations around B.C. and is grateful to carry out our work on these lands.
							We acknowledge the rights, interests, priorities and concerns of all Indigenous Peoples - First Nations, Métis and Inuit - respecting and acknowledging their distinct cultures, histories, rights, laws and governments.
						</Typography>
					</div>
				</Box>

			</Content>
		</Page>
	);
};

export default HomePage;
