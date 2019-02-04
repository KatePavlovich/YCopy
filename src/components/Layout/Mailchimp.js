import React, { Component } from 'react'
import axios from 'axios'
import { MAILCHIMP_INSTANCE, LIST_UNIQUE_ID, MAILCHIMP_API_KEY } from '../../../config'
import styles from './Mailchimp.module.scss'

class Mailchimp extends Component {
  state = {
    email: '',
    status: null,
    detail: null,
  }

  handleOnChange = (event) => {
    this.setState({ email: event.target.value })
  }

  handleOnSubmit = (event) => {
    event.preventDefault()

    let params = new URLSearchParams()
    params.append('email', this.state.email)
    params.append('mailchimpInstance', MAILCHIMP_INSTANCE)
    params.append('listUniqueId', LIST_UNIQUE_ID)
    params.append('mailchimpApiKey', MAILCHIMP_API_KEY)

    this.setState(
      {
        status: 'sending',
      },
      () =>
        axios.post(`${process.env.MAILCHIMP_MIDDLEWARE_API_URL}/api/subscribe`, params).then(({ data }) => {
          const { status, detail } = data
          this.setState({
            status,
            detail,
            email: '',
          })
        }),
    )
  }

  render() {
    const { status, detail } = this.state
    const emailTitle = status === 'subscribed' ? 'Подписка успешно оформлена' : 'Подпишитесь на полезную рассылку'
    const isError = status === 400

    return (
      <div>
        <form onSubmit={this.handleOnSubmit} className={styles.form}>
          <span className={styles.emailTitle}>{emailTitle}</span>
          <div className={styles.input}>
            <input
              type="email"
              required
              placeholder="e-mail"
              aria-label="email"
              value={this.state.email}
              onChange={this.handleOnChange}
              className={isError ? styles.errorInput : null}
            />
            {isError && (
              <div className={styles.errorField}>
                <p>{detail}</p>
              </div>
            )}
            <button
              type="Submit"
              className={status !== 'sending' ? styles.staticButton : styles.loadingButton}
              aria-label="submit"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default Mailchimp
