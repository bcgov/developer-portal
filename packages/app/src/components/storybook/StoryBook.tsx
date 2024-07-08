import { Content, Page } from '@backstage/core-components';
import React from 'react';

export const StoryBook = () => {
    return (
        <Page themeId="home">
            <Content>
                <iframe 
                    src="https://design-system-react-components-storybook-ed91fb-prod.apps.silver.devops.gov.bc.ca/"
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        border: 'none', 
                    }}
                />
            </Content>
        </Page>
    );
}