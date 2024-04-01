import { ActiveRoute } from './type';

export const isRouteActive = ({ asPath, url }: ActiveRoute): boolean => asPath === url;
