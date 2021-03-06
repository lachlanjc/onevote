import React, { Component } from 'react'
import styled from 'styled-components'
import theme from '../theme/config'
import { trim, isEmpty, keys, debounce, startCase, lowerCase } from 'lodash'
import { DropdownContainer, DropdownMenu, DropdownMenuOption } from './dropdown'
import { Box, Button, Flex, Label } from '@hackclub/design-system'
import Icon from '@hackclub/icons'
import Spinner from 'respin'
import SearchInput from './searchInput'
import PlacesAutocomplete from 'react-places-autocomplete'
import Location from './location'
import Group from './profile/group'
import PhoneSignup from './phoneSignup'
import VoteSignup from './voteSignup'

const formatAddress = address => `${startCase(lowerCase(address.line1))},
${startCase(lowerCase(address.city))}, ${address.state} ${address.zip}`

const SearchButton = styled(Button.button).attrs({
  px: 0,
  py: 0,
  ml: 3,
  children: props =>
    props.loading ? <Spinner size={24} /> : <Icon glyph="search" size={48} />
})`
  flex-shrink: 0;
  line-height: 0 !important;
  background: ${theme.colors.white};
  color: ${theme.colors.brand};
  border-radius: 32px;
  width: 64px;
  height: 64px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: ${theme.transition} box-shadow;
  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.125), 0 8px 24px rgba(0, 0, 0, 0.25);
  }
  &:active {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.25);
  }
`

class Search extends Component {
  state = {
    address: '',
    loading: false,
    pollingLocations: [],
    contests: [],
    error: null
  }

  handleChange = value => {
    this.setState({ address: value }, () => {
      this.debounceFetchData()
    })
  }

  debounceFetchData = debounce(this.fetchData, 250)

  fetchData() {
    const { address } = this.state
    console.log('Address', address)
    this.setState({ loading: true })
    const payload = { address }
    const query = keys(payload)
      .map(key => [key, payload[key]].map(encodeURIComponent).join('='))
      .join('&')
    const url = `/api/locate?${query}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.error) return
        console.log(data)
        const { pollingLocations = [], contests } = data // `pollingLocations` isn't present in some results
        this.setState({ loading: false, pollingLocations, contests })
      })
      .catch(e => {
        console.error(e)
        this.setState({ loading: false, error: 'error' })
      })
  }

  render() {
    const { loading, address, pollingLocations, contests, error } = this.state
    return (
      <Box my={3}>
        <Label htmlFor="address" mb={2} fontSize={2} color="muted" caps>
          Enter your home (U.S.) address
        </Label>
        <Searcher align="flex-end" width={1}>
          <PlacesAutocomplete value={address} onChange={this.handleChange}>
            {({
              getInputProps,
              getSuggestionItemProps,
              suggestions,
              ...props
            }) => (
              <DropdownContainer width={1}>
                <SearchInput
                  name="address"
                  id="address"
                  placeholder="1 Infinite Loop, Cupertino, CA"
                  {...getInputProps(props)}
                />
                {suggestions.length > 1 && (
                  <DropdownMenu>
                    {suggestions.map(suggestion => (
                      <DropdownMenuOption
                        key={suggestion.id}
                        active={suggestion.active}
                        children={suggestion.description}
                        {...getSuggestionItemProps(suggestion)}
                      />
                    ))}
                  </DropdownMenu>
                )}
              </DropdownContainer>
            )}
          </PlacesAutocomplete>
          <SearchButton
            loading={loading}
            onClick={e => !isEmpty(trim(address)) && this.fetchData()}
          />
        </Searcher>
        {pollingLocations.map(location => (
          <Location
            pollingPlaceAddress={formatAddress(location.address)}
            userAddress={address}
            key={`polling-${location.locationName}`}
          />
        ))}
        {contests.map(group => (
          <Group
            profiles={group.candidates}
            label={group.office}
            key={`group-${group.district.id}-${
              group.office || group.referendumTitle
            }`}
          />
        ))}
        <PhoneSignup />
        <VoteSignup />
      </Box>
    )
  }
}

const Searcher = styled(Flex)`
  input,
  button {
    height: 64px;
  }
`

export default Search
