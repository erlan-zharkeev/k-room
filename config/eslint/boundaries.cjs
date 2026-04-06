/**
 * Creates eslint-plugin-boundaries v6 configuration for FSD layer enforcement.
 * @param {Array<{type: string, pattern: string}>} layers - ordered top-to-bottom (app first, shared last)
 *
 * Each layer may import from itself and all layers below it.
 * Importing from a higher layer produces a warning.
 */
const createBoundariesConfig = (layers) => {
  const elements = layers.map(({ type, pattern }) => ({ type, pattern }))

  const rules = layers.map(({ type }, index) => ({
    from: { type },
    allow: { to: { type: layers.slice(index).map((l) => l.type) } }
  }))

  return { elements, rules }
}

module.exports = { createBoundariesConfig }
