/* eslint-disable no-undef */

jest.mock('firebase-admin', () => ({ auth: jest.fn(), storage: jest.fn(() => ({ bucket: jest.fn() })) }));

// jest.mock('node-geocoder', () => () => ({
//   geocode: () => [
//     {
//       latitude: null,
//       longitude: null,
//     },
//   ],
// }));
