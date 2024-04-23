import { ActiveRoute } from './type';

export const isRouteActive = ({ asPath, url }: ActiveRoute): boolean => asPath === url;

export const logError = (error: Error, info: { componentStack: string }): void => {
  console.error(`Error: ${error}`);
  console.error(`Error message: ${error.message}`);
  console.error(`Error caused by: ${info.componentStack}`);
};
