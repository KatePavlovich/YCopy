import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'gatsby'
import { OutboundLink } from 'gatsby-plugin-google-analytics'
import logo from '../../img/white-logo.svg'
import { getFullYear } from '../../utils/date'
import Mailchimp from './Mailchimp'
import styles from './Footer.module.scss'

const Footer = ({ className, normal }) => {
  return (
    <footer className={classNames(className, styles.root, { [styles.normal]: normal })}>
      <div className={styles.inner}>
        <header>
          <Link to="/" aria-label="home">
            Y
          </Link>
          <div className={styles.slogan}>Made in Minsk. With Love. {getFullYear()}</div>
        </header>
        <section className={styles.links}>
          <ul>
            <li className={styles.visibleSm}>
              <Link to="/" aria-label="home">
                На главную
              </Link>
            </li>
            <li>
              <Link to="/about" aria-label="about">
                О проекте
              </Link>
            </li>
            <li>
              <Link to="/contacts" aria-label="contacts">
                Контакты
              </Link>
            </li>
            <li>
              <Link to="/advertising" aria-label="advertisers">
                Рекламодателям
              </Link>
            </li>
            <li>
              <Link to="/legal-info" aria-label="legal-info">
                Правовая информация
              </Link>
            </li>
            <li>
              <OutboundLink href="mailto:info@yolife.is" aria-label="write email">
                Написать письмо
              </OutboundLink>
            </li>
          </ul>
        </section>
        <section className={styles.links}>
          <ul>
            <li>
              <OutboundLink
                href="https://www.facebook.com/Yolife.is"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Facebook"
              >
                Facebook
              </OutboundLink>
            </li>
            <li>
              <OutboundLink href="https://twitter.com/" target="_blank" rel="noreferrer noopener" aria-label="Twitter">
                Twitter
              </OutboundLink>
            </li>
            <li>
              <OutboundLink
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
              >
                Instagram
              </OutboundLink>
            </li>
            <li>
              <OutboundLink
                href="https://t.me/yolifeis"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Telegram"
              >
                Telegram
              </OutboundLink>
            </li>
            <li>
              <OutboundLink
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Youtube"
              >
                Youtube
              </OutboundLink>
            </li>
          </ul>
        </section>
        <section className={`${styles.links} ${styles.email}`}>
          <Mailchimp />
          <span className={styles.development}>
            Разработка{' '}
            <OutboundLink href="https://humanseelabs.com/" aria-label="humanseelabs">
              humanseelabs
            </OutboundLink>
          </span>
        </section>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  className: PropTypes.string,
  normal: PropTypes.bool,
}

export default Footer
