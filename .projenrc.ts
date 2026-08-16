import { javascript } from "projen";
import { TypeScriptESMProject } from "@ncfour-us/projen-utils";
const project = new TypeScriptESMProject({
  buildTagTask: true,
  devDeps: ["@ncfour-us/projen-utils"],
  eslintFlatConfig: true,
  name: "charts",
  packageManager: javascript.NodePackageManager.PNPM,
  prettierFlatConfig: true,
  projenrcTs: true,

  // defaultReleaseBranch: "main",                                           /* The name of the main release branch. */
  // deps: [],                                                               /* Runtime dependencies of this module. */
  // description: undefined,                                                 /* The description is just a string that helps people understand the purpose of the package. */
  // localPackageArchiveDir: ~/.local-build-packages,                        /* Location for local archive of released artifacts. */
  // packageName: undefined,                                                 /* The "name" in package.json. */
  // repoBuildPackageModel: RepoBuildPackageModel.LOCAL_DEV_BUILD_REGISTRY,  /* Type of repository, packaging, and release model to use. */
});
project.synth();