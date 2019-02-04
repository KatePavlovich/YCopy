import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SocialShare from '../../components/SocialShare'
import Content from '../../components/Content'
import PageHelmet from '../../components/PageHelmet'
import styles from './Contacts.module.scss'

class Contacts extends Component {
  render() {
    const { className, title, content, renderMore, seo, contentComponent } = this.props
    const Body = contentComponent || Content
    return (
      <Fragment>
        <section className={classNames(className, styles.root)}>
          <PageHelmet title={title} {...seo} />
          <div className={styles.description}>
            <header>
              <h1 className={styles.title}>{title}</h1>
            </header>
            <SocialShare />
            <Body content={content} />
          </div>
        </section>
        {renderMore && <div className={styles.renderMore}>{renderMore(styles)}</div>}
      </Fragment>
    )
  }
}

Contacts.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  renderMore: PropTypes.func,
}

export default Contacts
