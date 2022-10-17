import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'o9auva6y',
  dataset: 'production',
  apiVersion: '2022-10-17',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
