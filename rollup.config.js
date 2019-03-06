import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        name: 'maslow',
        file: 'dist/bundle.js',
        format: 'umd'
    },
    plugins: [
        resolve(),
        babel({ exclude: 'node_modules/**' }),
        commonjs()
    ]
}