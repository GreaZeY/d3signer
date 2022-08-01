import { importAll } from '../../../lib/utils';
export const fonts = importAll(require.context("", false, /.json$/));
