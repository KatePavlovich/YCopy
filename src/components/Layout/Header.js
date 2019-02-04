import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import SocialShare from '../../components/SocialShare'
import logo from '../../img/white-logo.svg'
import darkLogo from '../../img/logo.svg'
import iconSearch from '../../icons/white-search.svg'
import darkIconSearch from '../../icons/search.svg'
import styles from './Header.module.scss'

class Header extends Component {
  state = {
    isMenuShown: false,
    isSearchShown: false,
    query: '',
    searchResults: [],
  }

  disableScroll = () => {
    let scrollbarWidth
    if (typeof window !== 'undefined') {
      scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    }
    document.body.classList.add('modal-open')
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }

  handleMenuClick = () => {
    this.disableScroll()
    this.setState({
      isMenuShown: true,
    })
  }

  handleSearchClick = () => {
    this.disableScroll()
    this.setState(
      {
        isSearchShown: true,
      },
      () => this.searchInput.focus(),
    )
  }

  handleCloseClick = () => {
    document.body.classList.remove('modal-open')
    document.body.style.paddingRight = `0px`
    this.setState(
      {
        query: '',
        searchResults: [],
        isMenuShown: false,
        isSearchShown: false,
      },
      () => (this.searchInput.value = ''),
    )
  }

  handleSearchChange = (event) => {
    const query = event.target.value
    const searchResults = query.length >= 1 ? this.getSearchResults(`${query}* ${query}`) : []
    this.setState((s) => {
      return {
        ...s,
        searchResults,
        query,
      }
    })
  }

  handleEscapeClick = (event) => {
    if (event.keyCode === 27) {
      this.handleCloseClick()
    }
  }

  getSearchResults(query) {
    if (typeof window === 'undefined') {
      return []
    }
    if (!query || !window.__LUNR__) return []
    const lunrSearch = window.__LUNR__['ru']
    const searchResults = lunrSearch.index.search(query)
    return searchResults.map(({ ref }) => lunrSearch.store[ref])
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscapeClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscapeClick, false)
  }

  render() {
    const { className, variant, isInHot } = this.props
    const mocMenuItems = [
      {
        name: 'На главную',
        link: '/',
        id: 'jg8m',
      },
      {
        name: 'Журнал',
        link: '/journal/vi-v-svoyom-ume',
        id: 'f9jq',
      },
      {
        name: 'MINSK.LOVE',
        link: '/guides',
        id: 'ee5v',
      },
      {
        name: 'Yolife-tv',
        link: '/#video-cover',
        id: 'eu2c',
      },
      {
        name: 'Вызовы ',
        link: '/tag/vizovi',
        id: 'zc25',
      },
      {
        name: 'Люди',
        link: '/tag/lyudi',
        id: 'ned8',
      },
      {
        name: 'Практика',
        link: '/tag/praktika',
        id: 'ljze',
      },
      {
        name: 'Еда',
        link: '/tag/eda',
        id: '3a6r',
      },
      {
        name: 'Путешествия',
        link: '/tag/puteshestviya',
        id: '2ft6',
      },
    ]
    const logoHref = variant === 2 ? logo : darkLogo
    const iconSearchHref = variant === 2 ? iconSearch : darkIconSearch

    return (
      <header
        className={classNames(className, styles.root, {
          [styles['variant' + variant]]: !!variant,
          [styles.isInHot]: isInHot,
        })}
      >
        <Link to="/" aria-label="home">
          Y
        </Link>
        <nav>
          <a href="https://en.yolife.is/" aria-label="EN">
            <button className={styles.language} aria-label="change site language">
              EN
            </button>
          </a>
          <button className={styles.search} onClick={this.handleSearchClick} aria-label="search">
            <img
              alt=""
              {...{
                className: styles.iconSearch,
                src: iconSearchHref,
              }}
            />
          </button>
          <button className={styles.menu} onClick={this.handleMenuClick} aria-label="menu" />
        </nav>
        <aside className={this.state.isMenuShown ? styles.overlayShown : styles.overlayHidden}>
          <div className={styles.wrapper}>
            <button className={styles.close} onClick={this.handleCloseClick} aria-label="close menu">
              ✕
            </button>
            <div className={styles.list}>
              <ul className={styles.list}>
                {mocMenuItems.map((item) => (
                  <li className={styles.item} key={item.id}>
                    <Link to={item.link} onClick={this.handleCloseClick} aria-label={item.name}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className={styles.socials}>
                <SocialShare overflowMenu />
              </div>
            </div>
          </div>
        </aside>
        <aside className={this.state.isSearchShown ? styles.overlayShown : styles.overlayHidden}>
          <div className={styles.wrapper}>
            <button className={styles.close} onClick={this.handleCloseClick} aria-label="close menu">
              ✕
            </button>
            <input
              type="text"
              placeholder="Поиск..."
              className={styles.searchInput}
              aria-label="search"
              onChange={this.handleSearchChange}
              ref={(input) => {
                this.searchInput = input
              }}
            />
            <div className={styles.searchResults}>
              <ul className={styles.searchResultsList}>
                {this.state.searchResults.map((item) => (
                  <li key={item.url} className={styles.searchResultsItem} onClick={this.handleCloseClick}>
                    <Link to={item.url} aria-label={item.title}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </header>
    )
  }
}

Header.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.number,
}

export default Header
