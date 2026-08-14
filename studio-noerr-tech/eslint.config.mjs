import studio from '@sanity/eslint-config-studio'
import globals from 'globals'

export default [
  ...studio,
  {
    // One-off maintenance scripts, run with node.
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {...globals.node},
    },
  },
]
