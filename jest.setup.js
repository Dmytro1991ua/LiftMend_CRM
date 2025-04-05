import '@testing-library/jest-dom/extend-expect';
import { TextDecoder, TextEncoder } from 'util';

import dotenv from 'dotenv';

Object.assign(global, { TextDecoder, TextEncoder });

dotenv.config({ path: '.env.test' });
