import {
  TypeScriptESMProject,
  PnpmWorkspace,
  RepoBuildPackageModel,
} from '@ncfour-us/projen-utils';
import { javascript, JsonPatch } from 'projen';
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
});

const tsconfig = project.tryFindObjectFile('test/tsconfig.json');

tsconfig?.patch(JsonPatch.add('/compilerOptions/isolatedModules', true));

project.tryRemoveFile('pnpm-workspace.yaml');

const pnpmWorkSpace: PnpmWorkspace = new PnpmWorkspace(project, {
  allowBuilds: {
    'esbuild': true,
    'unrs-resolver': true,
    'canvas': true,
    'skia-canvas': true,
  },
  trustPolicyExclude: ['semver'],
});

project.addTask('examples', {
  description: 'compile examples',
  steps: [
    {
      execArgs: [
        'tsc',
        // '--build',
        '--project',
        'examples/tsconfig.json',
      ],
    },
  ],
});

project.addGitIgnore('examples/lib/');
project.addPackageIgnore('exmaples/lib/');

project.synth();
