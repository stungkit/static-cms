import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import releases from '../../lib/releases';
import Logo from './Logo';
import NavigationDrawer from './mobile-drawer/NavigationDrawer';
import Search from './search/Search';

import type { PaletteMode } from '@mui/material';
import type { ButtonTypeMap } from '@mui/material/Button';
import type { ExtendButtonBase } from '@mui/material/ButtonBase';
import type { DocsGroup, MenuItem, MenuLink, SearchablePage } from '../../interface';

const StyledAppBar = styled(AppBar)(
  ({ theme }) => `
    background: ${theme.palette.mode === 'light' ? theme.palette.primary.main : '#121212'};
  `,
);

const StyledToolbar = styled(Toolbar)(
  ({ theme }) => `
    gap: 12px;
    height: 72px;

    ${theme.breakpoints.down('lg')} {
      justify-content: space-between;
    }
  `,
);

const StyledIconsWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;

    ${theme.breakpoints.up('lg')} {
      flex-grow: 1;
    }
  `,
);

const StyledGithubLink = styled('a')(
  ({ theme }) => `
    display: flex;
    align-items: center;

    ${theme.breakpoints.down(1300)} {
      display: none;
    }
  `,
);

const StyledGithubImage = styled('img')`
  display: flex;
`;

const StyledMenuButton = styled(IconButton)(
  ({ theme }) => `
    z-index: 30;

    ${theme.breakpoints.up('lg')} {
      visibility: hidden;
      height: 0;
      width: 0;
      padding: 0;
    }
  `,
);

const StyledDesktopGap = styled('div')(
  ({ theme }) => `
    flex-grow: 1;

    ${theme.breakpoints.down('lg')} {
      display: none;
    }
  `,
);

const StyledDesktopLink = styled(Button)(
  ({ theme }) => `
    color: white;
    text-transform: none;
    min-width: unset;

    &:hover {
      color: rgba(255, 255, 255, 0.6);
    }

    ${theme.breakpoints.down('lg')} {
      display: none;
    }
  `,
) as ExtendButtonBase<ButtonTypeMap<{}, 'a'>>;

const STATIC_CMS_DOMAIN = 'staticjscms.netlify.app';
const DEFAULT_DEMO_SITE = 'demo-staticjscms.netlify.app';
const STATIC_CMS_DOMAIN_REGEX = /staticcms\.org$/g;

function createDemoUrl(subdomain?: string): string {
  return `https://${subdomain ? subdomain : ''}${DEFAULT_DEMO_SITE}/`;
}

interface HeaderProps {
  mode: PaletteMode;
  docsGroups: DocsGroup[];
  searchablePages: SearchablePage[];
  toggleColorMode: () => void;
}

const Header = ({ mode, docsGroups, searchablePages, toggleColorMode }: HeaderProps) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [demoUrl, setDemoUrl] = useState(createDemoUrl());
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.location.host.endsWith(STATIC_CMS_DOMAIN) ||
      window.location.host === `www.${STATIC_CMS_DOMAIN}`
    ) {
      return;
    }
    setDemoUrl(createDemoUrl(window.location.host.replace(STATIC_CMS_DOMAIN_REGEX, '')));
  }, []);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const items: MenuItem[] = useMemo(
    () => [
      {
        title: releases[0].version,
        url: '/releases',
      },
      {
        title: 'Docs',
        path: '/docs',
        groups: docsGroups.map(group => ({
          title: group.title,
          links: group.links.map(link => ({
            title: link.title,
            url: `/docs/${link.slug}`,
            beta: link.beta,
            deprecated: link.deprecated,
          })),
        })),
      },
      {
        title: 'Examples',
        url: '/docs/examples',
      },
      {
        title: 'Demo',
        url: demoUrl,
        target: '_blank',
      },
      {
        title: 'Community',
        url: '/community',
      },
    ],
    [demoUrl, docsGroups],
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <StyledMenuButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
          >
            <MenuIcon fontSize="large" />
          </StyledMenuButton>
          <Logo />
          <StyledIconsWrapper>
            <Search searchablePages={searchablePages} />
            <IconButton
              sx={{ [theme.breakpoints.up('lg')]: { ml: 1 } }}
              onClick={toggleColorMode}
              color="inherit"
              title={mode === 'dark' ? 'Turn on the light' : 'Turn off the light'}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <StyledDesktopGap />
            <StyledGithubLink
              href="https://github.com/StaticJsCMS/static-cms"
              aria-label="Star StaticJsCMS/static-cms on GitHub"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <StyledGithubImage
                alt="Star StaticJsCMS/static-cms on GitHub"
                src="https://img.shields.io/github/stars/StaticJsCMS/static-cms?style=social"
              />
            </StyledGithubLink>
            <IconButton href="https://github.com/StaticJsCMS/static-cms" color="inherit">
              <GitHubIcon />
            </IconButton>
          </StyledIconsWrapper>
          {items.map(item => {
            let url = '#';
            let target: MenuLink['target'];
            if ('url' in item) {
              url = item.url;
              target = item.target;
            } else if (item.groups.length > 0 && item.groups[0].links.length > 0) {
              url = item.groups[0].links[0].url;
            }

            return (
              <StyledDesktopLink
                key={`desktop-${item.title}-${url}`}
                component={Link}
                href={url}
                target={target}
              >
                {item.title}
              </StyledDesktopLink>
            );
          })}
        </StyledToolbar>
      </StyledAppBar>
      <NavigationDrawer
        key="mobile-navigation-drawer"
        items={items}
        mobileOpen={mobileOpen}
        onMobileOpenToggle={handleDrawerToggle}
      />
    </>
  );
};

export default Header;
