import * as React from 'react';
// tslint:disable-next-line:no-var-requires
const {BarLoader} = require('react-css-loaders');

interface LoaderProps {
  isLoading?: () => boolean;
}

type LoaderHOC = <P>(
  Component: React.ComponentType<P>
) => React.ComponentType<P & LoaderProps>;

const withLoader: LoaderHOC = Component => ({isLoading, ...rest}: any) =>
  isLoading ? (
    <BarLoader color="rgba(0,0,0,0.2)" size={5} />
  ) : (
    <Component {...rest} />
  );

export default withLoader;
