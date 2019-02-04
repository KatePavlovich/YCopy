import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import memoize from 'lodash/memoize'
import { Header } from '../../components/Layout'
import iconArrowDown from '../../icons/white-chevron-down.svg'
import PostCard from './PostCard'
import Excerpt from './Excerpt'
import { Link } from 'react-scroll'
import styles from './Hot.module.scss'

class Hot extends Component {
  state = {
    index: 0,
  }

  handlePostCardMouseEnter = memoize((index) => () => {
    this.setState({
      index,
    })
  })

  handlePostCardMouseLeave = () => {
    this.setState({
      index: 0,
    })
  }

  getImageStyle = memoize((image) => {
    return {
      backgroundImage: `url(${image})`,
    }
  })

  componentWillUnmount() {
    this.handlePostCardMouseEnter.cache.clear()
    this.getImageStyle.cache.clear()
  }

  render() {
    const { className, posts } = this.props
    const post = posts[this.state.index]
    return (
      <Fragment>
        <div className={styles.container}>
          <div className={classNames(className, styles.root)} style={this.getImageStyle(post.image)}>
            <div className={styles.wrapper}>
              <Header variant={2} isInHot />
              <div className={styles.content}>
                <Excerpt url={`/post/${post.slug}`} title={post.title} description={post.description} />
              </div>
              <div className={styles.chevron}>
                <Link
                  to="content"
                  spy={true}
                  smooth={true}
                  duration={200}
                  aria-label="down"
                  className={styles.arrowDown}
                >
                  <img
                    alt=""
                    {...{
                      src: iconArrowDown,
                      width: 32,
                      height: 32,
                    }}
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.postCards}>
            <div className={styles.postCardsWrapper}>
              {posts.slice(1, 4).map((item, index) => (
                <PostCard
                  {...{
                    key: item.slug,
                    ...item,
                    onMouseEnter: this.handlePostCardMouseEnter(index + 1),
                    onMouseLeave: this.handlePostCardMouseLeave,
                    isSelected: this.state.index === index + 1,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

Hot.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.array,
}

export default Hot
