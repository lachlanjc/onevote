import React from 'react'
import styled from 'styled-components'
import Link from '../theme/link'
import theme from '../theme/config'
import { Flex, Container } from '@hackclub/design-system'
import Icon from '@hackclub/icons'

const Base = Container.withComponent(Flex)

const Social = styled(Link).attrs({ ml: 3 })`
  color: ${theme.colors.muted};
  &:hover,
  &:focus {
    color: ${theme.colors.brand};
  }
`

const link = 'https://onevote-pennapps.herokuapp.com'
const twitterURL = (text, url) =>
  `https://twitter.com/intent/tweet?text=${text
    .split(' ')
    .join('%20')}&url=${url}`
const facebookURL = url => `https://www.facebook.com/sharer/sharer.php?u=${url}`

const Header = () => (
  <Base justify="space-between" wrap width={1} maxWidth={48} px={3} py={[3, 4]}>
    <Link color={theme.colors.brand} href="/" prefetch fontSize={3} bold>
      OneVote
    </Link>
    <div>
      <Social href={twitterURL('OneVote', link)}>
        <Icon glyph="twitter" size={32} />
      </Social>
      <Social href={facebookURL(link)}>
        <Icon glyph="facebook" size={32} />
      </Social>
    </div>
  </Base>
)

export default Header
