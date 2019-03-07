import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    external: ['fast-clone', 'redux'],
    output: {
        name: 'maslow',
        file: 'dist/bundle.js',
        format: 'cjs'
    },
    plugins: [
        resolve(),
        babel({ exclude: 'node_modules/**' }),
        // commonjs({
        //     namedExports: {
        //         'dist/bundle.js': [ 'ModuleCreator' ]
        //     }
        // })
    ]
}