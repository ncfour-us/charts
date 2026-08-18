import {
  TypeScriptESMProject,
  PnpmWorkspace,
  RepoBuildPackageModel,
} from '@ncfour-us/projen-utils';
import { javascript, JsonFile, JsonPatch } from 'projen';
const project = new TypeScriptESMProject({
  buildTagTask: true,
  devDeps: [
    '@ncfour-us/projen-utils@file:/home/tjh/Projects/repos/ncfour-us/projen-utils/dist/js/projen-utils@0.0.0.jsii.tgz',
    'typescript@^6',
    '@jest/globals',
  ],
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

// const tsconfigProjen = project.tryFindObjectFile('projenrc/tsconfig.json');
// console.log(
//   `tsconfigDev tsconfig path: ${project.tsconfigDev.file.path}, projen tsconfig path: ${tsconfigProjen?.path}`,
// );
// if (tsconfigProjen) {
//   project.defaultTask?.reset(`tsx --tsconfig ${tsconfigProjen.path} .projenrc.ts`);
// }

// const tsconfigTest = project.tryFindObjectFile('test/tsconfig.json');
// const tsconfigDev = project.tryFindObjectFile('tsconfig.dev.json');
// if (!tsconfigDev) {
//   console.log('tsconfig.dev.json NOT FOUND!');
// }

// if (tsconfigTest) {
//   tsconfigTest.patch(JsonPatch.add('/compilerOptions/isolatedModules', true));

//   const packageJson = project.tryFindObjectFile('package.json');
//   if (packageJson) {
//     packageJson.patch(
//       JsonPatch.replace('/jest/transform', {
//         '^.+\\.(mt|t|cj|j)s$': [
//           'ts-jest',
//           {
//             useESM: true,
//             tsconfig: 'test/tsconfig.json',
//           },
//         ],
//       }),
//     );
//   }
// }

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

const tsConfigExamples = new JsonFile(project, 'examples/tsconfig.json', {
  committed: true,
  executable: false,
  marker: true,
  readonly: true,
  allowComments: true,
  newline: true,
  obj: {
    extends: '../tsconfig.json',
    compilerOptions: {
      rootDir: '..',
      rootDirs: ['../examples', '../src'],
      outDir: 'lib',
      isolatedModules: true,
    },
    include: ['**/*.ts'],
    exclude: ['lib'],
  },
});

// Task "release" depends on "publish:git" ... temporarily remove it

// project.tasks.removeTask('release');

// Patch/Replace this:
// "publish:git": {
//   "name": "publish:git",
//   "description": "Prepends the release changelog onto the project changelog, creates a release commit, and tags the release",
//   "env": {
//     "CHANGELOG": "dist/changelog.md",
//     "RELEASE_TAG_FILE": "dist/releasetag.txt",
//     "PROJECT_CHANGELOG_FILE": "CHANGELOG.md",
//     "VERSION_FILE": "dist/version.txt"
//   },
//   "steps": [
//     {
//       "builtin": "release/update-changelog"
//     },
//     {
//       "builtin": "release/tag-version"
//     }
//   ],
//   "condition": "git log --oneline -1 | grep -v \"chore(release):\" > /dev/null && test \"$(git branch --show-current)\" = \"main\""
// },

// project.tasks.removeTask('publish:git');
// project.addTask('publish:git', {
//   description:
//     'PATCH PATCH PATCH: Prepends the release changelog onto the project changelog, creates a release commit, and tags the release',
//   env: {
//     CHANGELOG: 'dist/changelog.md',
//     RELEASE_TAG_FILE: 'dist/releasetag.txt',
//     PROJECT_CHANGELOG_FILE: 'CHANGELOG.md',
//     VERSION_FILE: 'dist/version.txt',
//   },
//   steps: [
//     {
//       builtin: 'release/update-changelog',
//     },
//     {
//       builtin: 'release/tag-version',
//     },
//   ],
//   condition:
//     'git log --oneline -1 | grep -v "chore(release):" > /dev/null && sh -c "test \\"$(git branch --show-current)\\" = \\"main\\""',
// });

// add the "release" task back in ...
// "release": {
//   "name": "release",
//   "description": "Prepare a release from \"main\" branch",
//   "env": {
//     "RELEASE": "true"
//   },
//   "steps": [
//     {
//       "exec": "rm -fr dist"
//     },
//     {
//       "spawn": "bump"
//     },
//     {
//       "spawn": "build"
//     },
//     {
//       "spawn": "unbump"
//     },
//     {
//       "exec": "git diff --ignore-space-at-eol --exit-code"
//     },
//     {
//       "spawn": "publish:git"
//     },
//     {
//       "spawn": "publish:local"
//     }
//   ]
// },

// project.addTask('release', {
//   description: 'TEMP REPLACE: Prepare a release from "main" branch',
//   env: {
//     RELEASE: 'true',
//   },
//   steps: [
//     {
//       exec: 'rm -fr dist',
//     },
//     {
//       spawn: 'bump',
//     },
//     {
//       spawn: 'build',
//     },
//     {
//       spawn: 'unbump',
//     },
//     {
//       exec: 'git diff --ignore-space-at-eol --exit-code',
//     },
//     {
//       spawn: 'publish:git',
//     },
//     {
//       spawn: 'publish:local',
//     },
//   ],
// });

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
project.addPackageIgnore('examples/lib/');

project.synth();
