import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const createBaseConfig = () => {
  return {
    input: 'src/index.js',
    output: {
      file: '',
      name: 'Timeout',
      format: 'umd',
      banner: `/* ${pkg.name} v${pkg.version} by ${pkg.author.name} */`
    },
    plugins: []
  };
};

const createES6Config = () => {
  const config = createBaseConfig();
  config.output.file = 'dist/es6.js';
  return config;
};

const createES5Config = () => {
  const config = createBaseConfig();
  config.output.file = 'dist/es5.js';
  config.plugins.push(
    babel({
      babelrc: false,
      presets: [['@babel/env', { modules: false }]],
      exclude: 'node_modules/**'
    }),
  );
  return config;
};

export default [
  createES6Config(),
  createES5Config(),
];
