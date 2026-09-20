// Copyright (c) 2026 Tim Hahn

import {
  TypeScriptESMProject,
  RepoBuildPackageModel,
  sampleReadmeProps,
  ExamplesFolder,
} from '@ncfour-us/projen-utils';
import { javascript } from 'projen';

const project = new TypeScriptESMProject({
  authorName: 'Tim Hahn',
  authorEmail: 'hahntj@gmail.com',

  defaultReleaseBranch: 'main',
  name: '@ncfour-us/charts',
  description: 'A set of chart generation objects which uses Chart.js',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,

  repository: 'https://github.com/ncfour-us/charts.git',

  packageName: '@ncfour-us/charts',

  // set up the project with a LICENSE and copyright info
  license: 'MIT',
  copyrightOwner: 'Tim Hahn',
  copyrightPeriod: '2026',

  devDeps: ['@ncfour-us/projen-utils', 'typescript@^6', '@jest/globals'],
  deps: ['@ncfour-us/logging', 'chart.js', 'skia-canvas', 'sharp', 'canvas', '@ncfour-us/stats'],

  eslintFlatConfig: true,
  prettierFlatConfig: true,
  precommitConfig: true,
  pnpmWorkspace: true,

  repoBuildPackageModel: RepoBuildPackageModel.LOCAL_BUILD_PACKAGE,
  localPackageArchiveDir: '~/.tjh-packages',
  releaseToLocal: true,
  releaseToNpm: true,
  releaseToGithub: true,
  buildTagTask: true,

  docsIndex: true,
  apiDocumentation: true,
  apiEntryPoints: ['src/index.ts'],

  readme: sampleReadmeProps({
    namespace: '@ncfour-us',
    project: 'charts',
    author: 'Tim Hahn',
    authorEmail: 'hahntj@gmail.com',
    authorGithubUser: 'climbertjh',
    license: 'MIT',
  }),
});

// mark the entry points to the module
project.addFields({
  exports: {
    '.': './lib/index.js',
  },
});

// const tsconfigTest = project.tryFindObjectFile('test/tsconfig.json');

// if (tsconfigTest) {
//   tsconfigTest.patch(JsonPatch.add('/compilerOptions/isolatedModules', true));

//   tsconfigTest.patch(JsonPatch.replace('/include', ['../**/*.ts', '../.projenrc.ts']));
// }

// project.tryRemoveFile('pnpm-workspace.yaml');
// const pnpmWorkspace = new PnpmWorkspace(project);

const pnpmWorkspace = project.tryFindObjectFile('pnpm-workspace.yaml');

if (pnpmWorkspace) {
  pnpmWorkspace.addOverride('allowBuilds.canvas', true);
  pnpmWorkspace.addOverride('allowBuilds.skia-canvas', true);
  //   pnpmWorkspace.addOverride('allowBuilds.unrs-resolver', true);
  //   pnpmWorkspace.addOverride('trustPolicyExclude', ['semver']);
  pnpmWorkspace.addOverride('minimumReleaseAgeExclude', ['@ncfour-us/stats']);
}
// project.tryRemoveFile('pnpm-workspace.yaml');

// new PnpmWorkspace(project, {
//   allowBuilds: {
//     'esbuild': true,
//     'unrs-resolver': true,
//     'canvas': true,
//     'skia-canvas': true,
//   },
//   trustPolicyExclude: ['semver'],
// });

// project.package.file.patch(JsonPatch.add('/jest/extensionsToTreatAsEsm', ['.ts']));
// project.package.file.patch(
//   JsonPatch.add('/jest/moduleNameMapper', {
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   }),
// );

const precommitConfig = project.tryFindObjectFile('.pre-commit-config.yaml');

if (precommitConfig) {
  // Add exclude for "trailing-whitespace" hook to exclude test snapshots
  precommitConfig.addOverride(
    'repos.1.hooks.0.exclude',
    '(.*\.svg|^\.yarn/.*|test/__snapshots__/.*)$',
  );
  // add exclude for "check-added-large-files" hook to exclude test snapshots
  precommitConfig.addOverride('repos.1.hooks.2.exclude', '^(test/__snapshots__/.*)$');
}

// Update the "test" task to REMOVE the --updateSnapshots option which is added by default in projen
const testTask = project.tasks.tryFind('test');
if (testTask) {
  testTask?.updateStep(0, {
    execArgs: ['jest', '--passWithNoTests'],
    receiveArgs: true,
  });
}

new ExamplesFolder(project, {
  exampleTsFile: false,
});

project.synth();
