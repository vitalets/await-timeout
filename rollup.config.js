import banner from 'rollup-plugin-banner';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.umd.js',
    name: 'Timeout',
    format: 'umd'
  },
  plugins: [
    banner('<%= pkg.name %> v<%= pkg.version %> by <%= pkg.author.name %>')
  ]
};
