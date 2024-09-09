import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { styled, useTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useMemo } from 'react';

import Logo from '../Logo';
import MobileNavItem from './MobileNavItem';

import type { MenuItem } from '../../../interface';

const DRAWER_WIDTH = 300;

const StyledDrawerContents = styled('div')`
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledLogoWrapper = styled('div')(
  ({ theme }) => `
    display: flex;
    justify-content: center;
    padding: 16px 0;
    background: ${
      theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.paper
    };
  `,
);

interface NavigationDrawerProps {
  items: MenuItem[];
  mobileOpen: boolean;
  onMobileOpenToggle: () => void;
}

const NavigationDrawer = ({ items, mobileOpen, onMobileOpenToggle }: NavigationDrawerProps) => {
  const theme = useTheme();

  const iOS = useMemo(
    () => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent),
    [],
  );

  const drawer = useMemo(
    () => (
      <StyledDrawerContents key="drawer-nav-contents" onClick={onMobileOpenToggle}>
        <StyledLogoWrapper key="drawer-nav-logo-wrapper">
          <Logo key="drawer-nav-logo" inMenu />
        </StyledLogoWrapper>
        <Divider key="drawer-nav-divider" sx={{ borderColor: 'rgba(255, 255, 255, 0.8)' }} />
        <List key="drawer-nav-list" sx={{ flexGrow: 1 }}>
          {items.map(item => (
            <MobileNavItem key={`drawer-nav-item-${item.title}`} item={item} />
          ))}
        </List>
      </StyledDrawerContents>
    ),
    [items, onMobileOpenToggle],
  );

  const container = useMemo(
    () => (typeof window !== 'undefined' ? window.document.body : undefined),
    [],
  );

  return (
    <SwipeableDrawer
      key="swipable-drawer"
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      container={container}
      variant="temporary"
      open={mobileOpen}
      onOpen={onMobileOpenToggle}
      onClose={onMobileOpenToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: 'none',
        [theme.breakpoints.down('lg')]: {
          display: 'block',
        },
        width: '80%',
        maxWidth: DRAWER_WIDTH,
        '& .MuiBackdrop-root': {
          width: '100%',
        },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: '80%',
          maxWidth: DRAWER_WIDTH,
          background: theme.palette.background.paper,
        },
        '& .MuiListSubheader-root': {
          textAlign: 'left',
        },
      }}
    >
      {drawer}
    </SwipeableDrawer>
  );
};

export default NavigationDrawer;
