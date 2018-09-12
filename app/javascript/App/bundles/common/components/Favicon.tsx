import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import * as URL from 'url-parse'
import { ImgHTMLAttributes } from 'react'

const getFaviconUrl = (url: string) => {
  const parsedUrl = URL(url)
  return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}`
}

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  classes: any
  url: string
}

const styles = (theme) =>
  createStyles({
    root: {},
  })

const Favicon: React.StatelessComponent<Props> = (props) => {
  const { classes, url, ...otherProps } = props

  return (
    <img src={getFaviconUrl(url)} className={classes.root} {...otherProps} />
  )
}

export default withStyles(styles)(Favicon)
