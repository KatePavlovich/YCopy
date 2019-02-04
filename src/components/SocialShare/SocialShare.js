import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { OutboundLink } from 'gatsby-plugin-google-analytics'
import iconFacebookGray from '../../icons/facebook-gray.svg'
import iconTwitterGray from '../../icons/twitter-gray.svg'
import iconTelegramGray from '../../icons/telegram-gray.svg'
import iconFacebookBlack from '../../icons/facebook-black.svg'
import iconTwitterBlack from '../../icons/twitter-black.svg'
import iconTelegramBlack from '../../icons/telegram-black.svg'
import styles from './SocialShare.module.scss'

class SocialShare extends Component {
  constructor(props) {
    super(props)
    let path = ''

    if (typeof window !== 'undefined') {
      path = window.location.pathname
    }

    this.state = { path }
  }

  render() {
    const { className, vertical, noIndentation, overflowMenu, journalPostVariation } = this.props
    const encodedUrl = encodeURIComponent(`https://yolife.is${this.state.path}`)
    const iconFacebookHref = !overflowMenu ? iconFacebookGray : iconFacebookBlack
    const iconTelegramHref = !overflowMenu ? iconTelegramGray : iconTelegramBlack
    const iconTwitterHref = !overflowMenu ? iconTwitterGray : iconTwitterBlack

    return (
      <div
        className={classNames(className, styles.root, {
          [styles.vertical]: vertical,
          [styles.noIndentation]: noIndentation,
          [styles.overflowMenu]: overflowMenu,
          [styles.journalPostVariation]: journalPostVariation,
        })}
      >
        <ul className={styles.list}>
          <li className={styles.item}>
            <OutboundLink
              className={styles.link}
              href={`https://facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="facebook"
            >
              <img
                alt=""
                {...{
                  className: styles.icon,
                  src: iconFacebookHref,
                }}
              />
            </OutboundLink>
          </li>
          <li className={styles.item}>
            <OutboundLink
              className={styles.link}
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="twitter"
            >
              <img
                alt=""
                {...{
                  className: styles.icon,
                  src: iconTwitterHref,
                }}
              />
            </OutboundLink>
          </li>
          <li className={styles.item}>
            <OutboundLink
              className={styles.link}
              href={`https://telegram.me/share?url=${encodedUrl}`}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="telegram"
            >
              <img
                alt=""
                {...{
                  className: styles.icon,
                  src: iconTelegramHref,
                }}
              />
            </OutboundLink>
          </li>
        </ul>
      </div>
    )
  }
}

SocialShare.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  url: PropTypes.string,
  vertical: PropTypes.bool,
  noIndentation: PropTypes.bool,
  overflowMenu: PropTypes.bool,
}

export default SocialShare
