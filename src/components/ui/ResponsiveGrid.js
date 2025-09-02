import React from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';

const ResponsiveGrid = ({ children, spacing = 3 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Grid container spacing={isMobile ? 2 : spacing}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          // Auto-adjust grid sizes based on screen size
          const mobileProps = { xs: 12 };
          const tabletProps = { xs: 12, md: 6 };
          const desktopProps = child.props;

          const responsiveProps = isMobile 
            ? mobileProps 
            : isTablet 
              ? { ...tabletProps, ...desktopProps }
              : desktopProps;

          return (
            <Grid item key={index} {...responsiveProps}>
              {child}
            </Grid>
          );
        }
        return child;
      })}
    </Grid>
  );
};

export default ResponsiveGrid;
