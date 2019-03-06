import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        name: 'freud',
        file: 'dist/bundle.js',
        format: 'umd'
    },
    moduleContext: {
        'node_modules/whatwg-fetch/fetch.js': 'window'
    },
    plugins: [
        resolve(),
        babel({ exclude: 'node_modules/**' }),
        commonjs()
    ]
}