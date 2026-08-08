import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { contentSchemaTypes, staffAccessSchemaTypes } from './schemaTypes';

export default defineConfig([
  {
    name: 'nagm-spa-content',
    title: 'Nagm Spa Blog',
    basePath: '/content',
    projectId: 'nzy22u9z',
    dataset: 'production',
    plugins: [structureTool()],
    schema: {
      types: contentSchemaTypes,
    },
  },
  {
    name: 'nagm-spa-staff-access',
    title: 'Nagm Spa Staff Access',
    basePath: '/staff-auth',
    projectId: 'nzy22u9z',
    dataset: 'staff-auth',
    plugins: [structureTool()],
    schema: {
      types: staffAccessSchemaTypes,
    },
  },
]);
