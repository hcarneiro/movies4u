module.exports.generateStubs = (component) => {
  const children = component instanceof Function
    ? component.extendOptions.components
    : component.components
  const reducer = (accumulator, value) => {
    const lhs = value[0]
    const rhs = value.substr(1)
    const name = (lhs + rhs.replace(/([A-Z])/g, '-$1')).toLowerCase()
    accumulator[name] = {
      render(createElement) {
        return createElement(name, this.$slots.default)
      }
    }
    return accumulator
  }
  return children ? Object.keys(children).reduce(reducer, {}) : undefined
}
