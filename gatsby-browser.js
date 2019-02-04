exports.onClientEntry = () => {
  if (typeof window.IntersectionObserver === `undefined`) {
    require(`intersection-observer`)
  }
}
