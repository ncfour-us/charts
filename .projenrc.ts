import {
  TypeScriptESMProject,
  PnpmWorkspace,
  RepoBuildPackageModel,
  ExamplesFolder,
} from '@ncfour-us/projen-utils';
import { javascript, JsonFile, JsonPatch } from 'projen';
import { TypescriptConfig, TypescriptConfigExtends } from 'projen/lib/javascript';

const project = new TypeScriptESMProject({
  buildTagTask: true,
  devDeps: ['@ncfour-us/projen-utils', 'typescript@^6', '@jest/globals'],
  eslintFlatConfig: true,
  name: '@ncfour-us/charts',
  packageManager: javascript.NodePackageManager.PNPM,
  prettierFlatConfig: true,
  projenrcTs: true,

  // defaultReleaseBranch: "main",                                           /* The name of the main release branch. */
  deps: ['@ncfour-us/logging', 'chart.js', 'skia-canvas', 'sharp', 'canvas'],
  description: 'A set of chart generation objects which uses Chart.js',
  // localPackageArchiveDir: ~/.local-build-packages,                        /* Location for local archive of released artifacts. */
  // packageName: undefined,                                                 /* The "name" in package.json. */
  // repoBuildPackageModel: RepoBuildPackageModel.LOCAL_DEV_BUILD_REGISTRY,  /* Type of repository, packaging, and release model to use. */
  precommitConfig: true,

  repoBuildPackageModel: RepoBuildPackageModel.LOCAL_BUILD_PACKAGE,
  localPackageArchiveDir: '~/.tjh-packages',
  releaseToLocal: true,
});

const tsconfigTest = project.tryFindObjectFile('test/tsconfig.json');

if (tsconfigTest) {
  tsconfigTest.patch(JsonPatch.add('/compilerOptions/isolatedModules', true));

  tsconfigTest.patch(JsonPatch.replace('/include', ['../**/*.ts', '../.projenrc.ts']));
}

project.tryRemoveFile('pnpm-workspace.yaml');
const pnpmWorkspace = new PnpmWorkspace(project);

// const pnpmWorkspace = project.tryFindObjectFile('pnpm-workspace.yaml');

if (pnpmWorkspace) {
  pnpmWorkspace.addOverride('allowBuilds.canvas', true);
  pnpmWorkspace.addOverride('allowBuilds.skia-canvas', true);
  pnpmWorkspace.addOverride('allowBuilds.unrs-resolver', true);
  pnpmWorkspace.addOverride('trustPolicyExclude', ['semver']);
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

project.package.file.patch(JsonPatch.add('/jest/extensionsToTreatAsEsm', ['.ts']));
project.package.file.patch(
  JsonPatch.add('/jest/moduleNameMapper', {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  }),
);

new ExamplesFolder(project, {
  exampleTsFile: false,
});

project.synth();
