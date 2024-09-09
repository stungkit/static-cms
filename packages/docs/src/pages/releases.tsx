import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import Container from '../components/layout/Container';
import Page from '../components/layout/Page';
import config from '../lib/config';
import { getDocsMenuStaticProps } from '../lib/docs';
import releaseData from '../lib/releases';
import { isNotEmpty } from '../util/string.util';

import type { DocsMenuProps } from '../lib/docs';

const StyledReleaseContent = styled('div')(
  ({ theme }) => `
    width: 100%;
    padding-top: 72px;
    min-height: calc(100dvh - 72px);
    display: flex;
    flex-direction: column;
    gap: 20px;

    ${theme.breakpoints.between('md', 'lg')} {
      padding-top: 48px;
      gap: 16px
    }

    ${theme.breakpoints.down('md')} {
      padding-top: 32px;
      gap: 16px
    }
  `,
);

const StyledTitle = styled('div')(
  ({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    ${theme.breakpoints.down('lg')} {
      gap: 4px
    }
  `,
);

const StyledReleaseLinks = styled('section')(
  ({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0 32px;
    flex-grow: 1;
    gap: 40px;

    ${theme.breakpoints.between('md', 'lg')} {
      padding: 24px 0 32px;
      gap: 32px;
    }

    ${theme.breakpoints.down('md')} {
      padding: 24px 0 32px;
      gap: 24px;
    }
  `,
);

const StyledReleaseLinksContent = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`;

const StyledReleaseSection = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledLink = styled(Link)(
  ({ theme }) => `
    color: ${theme.palette.text.primary};
  `,
);

const Releases = ({ docsGroups, searchablePages }: DocsMenuProps) => {
  return (
    <Page url="/releases" docsGroups={docsGroups} searchablePages={searchablePages} fullWidth>
      <StyledReleaseContent>
        <StyledReleaseLinks>
          <Container>
            <StyledTitle>
              <Typography variant="h1" color="primary">
                Static CMS Versions
              </Typography>
              <Typography variant="body2" color="text.primary" fontSize={16}>
                A complete release history for Static CMS is available on GitHub.
                <br />
                <br />
                Changelogs for all releases can also be found below.
              </Typography>
            </StyledTitle>
          </Container>
          <Container>
            <StyledReleaseLinksContent>
              {releaseData.map(release => {
                return (
                  <StyledReleaseSection key={release.version}>
                    <Typography variant="h3" color="primary.main">
                      <strong>{release.version}</strong>
                      &nbsp;&nbsp;
                      <Box component="small" sx={{ fontSize: '16px', opacity: 0.75 }}>
                        {format(parseISO(release.date), 'MMM dd, yyyy')}
                      </Box>
                    </Typography>
                    <Typography
                      variant="body1"
                      component="div"
                      color="inherit"
                      sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                      {isNotEmpty(release.description) ? release.description : null}
                      <Box sx={{ display: 'flex', gap: '8px' }}>
                        <StyledLink
                          href={`${config.repo_url}/releases/tag/${release.version}`}
                          target="_blank"
                        >
                          Changelog
                        </StyledLink>
                      </Box>
                    </Typography>
                  </StyledReleaseSection>
                );
              })}
            </StyledReleaseLinksContent>
          </Container>
        </StyledReleaseLinks>
      </StyledReleaseContent>
    </Page>
  );
};

export default Releases;

export const getStaticProps = getDocsMenuStaticProps;
