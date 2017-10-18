import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'

export default {
  getRoutes: () => [
    {
      path: '/',
    },
  ],
  Html: class CustomHtml extends Component {
    render () {
      const { Html, Head, Body, children } = this.props

      const sheet = new ServerStyleSheet()
      const newChildren = sheet.collectStyles(children)
      const styleTags = sheet.getStyleElement()

      const title = 'This is Thicket, an Offline First app built for the most extreme network conditions'
      const description = "Citrusbyte can build new types of apps that don't require any central servers. Learn about one called Thicket."

      return (
        <Html>
          <Head>
            <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="og:title" content={title} />
            <meta name="og:description" content={description} />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:creator" content="@citrusbyte" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {styleTags}
          </Head>
          <Body>{newChildren}</Body>
        </Html>
      )
    }
  },
}
