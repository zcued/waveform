import path from 'path'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import typescript from 'rollup-plugin-typescript2'

const createBabelConfig = require('./babel.config')

const { root } = path.parse(process.cwd())
const external = id => !id.startsWith('.') && !id.startsWith(root)
const extensions = ['.js', '.ts', '.tsx']
const getBabelOptions = targets => ({
  ...createBabelConfig({ env: env => env === 'build' }, targets),
  extensions
})

function createESMConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'esm' },
    external,
    plugins: [
      typescript(),
      babel(getBabelOptions({ node: 8 })),
      sizeSnapshot(),
      resolve({ extensions })
    ]
  }
}

function createCommonJSConfig(input, output) {
  return {
    input,
    output: { file: output, format: 'cjs', exports: 'named' },
    external,
    plugins: [
      typescript(),
      babel(getBabelOptions({ ie: 11 })),
      sizeSnapshot(),
      resolve({ extensions })
    ]
  }
}

export default [
  createESMConfig('src/index.tsx', 'dist/index.js'),
  createCommonJSConfig('src/index.tsx', 'dist/index.cjs.js'),
  createCommonJSConfig('src/draw.ts', 'dist/draw.js'),
  createCommonJSConfig('src/theme.ts', 'dist/theme.js')
]