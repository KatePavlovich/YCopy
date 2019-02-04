import React from 'react'
import each from 'lodash/each'
import partial from 'lodash/partial'

export default (queries = {}) => (Component) => {
  if (typeof window === 'undefined') {
    return Component
  }

  class Proxy extends React.Component {
    constructor(props) {
      super(props)

      this.onQueryMatchChange = this.onQueryMatchChange.bind(this)

      const initialState = {}
      const unlisteners = {}

      each(queries, (queryStr, queryKey) => {
        const { matches, unlisten } = this.createQueryDescriptor(queryStr, queryKey)

        initialState[queryKey] = matches
        unlisteners[queryKey] = unlisten
      })

      this.unlisteners = unlisteners
      this.state = initialState
    }

    createQueryDescriptor(queryStr, queryKey) {
      let mql
      if (typeof window !== 'undefined') {
        mql = window.matchMedia(queryStr)
      }
      const listener = partial(this.onQueryMatchChange, queryKey)

      mql.addListener(listener)

      return {
        matches: mql.matches,
        unlisten: () => mql.removeListener(listener),
      }
    }

    componentWillUnmount() {
      each(this.unlisteners, (unlistenQuery) => unlistenQuery())
    }

    onQueryMatchChange(queryKey, evt) {
      this.setState({
        [queryKey]: evt.matches,
      })
    }

    render() {
      return <Component {...this.props} {...this.state} />
    }
  }

  Proxy.displayName = `WithMediaQuery(${Component.displayName || 'Component'})`

  return Proxy
}
