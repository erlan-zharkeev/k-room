import type { LookupAddress } from 'node:dns'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import type { LookupFunction } from 'node:net'

import {
  MESSAGE_LINK_PREVIEW_PRIVATE_IPV4_CIDRS,
  MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_EXACT_ADDRESSES,
  MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_PREFIXES
} from '../messages.constants'

const parseIpv4Address = (address: string) => {
  const parts = address.split('.').map(Number)
  const hasValidPartCount = parts.length === 4
  const hasValidParts = parts.every((part) => {
    const isInteger = Number.isInteger(part)
    const isInMinRange = part >= 0
    const isInMaxRange = part <= 255

    return isInteger && isInMinRange && isInMaxRange
  })

  if (!hasValidPartCount || !hasValidParts) return null

  return parts.reduce((value, part) => value * 256 + part, 0) >>> 0
}

const isIpv4AddressInCidr = (address: string, cidr: string) => {
  const addressValue = parseIpv4Address(address)
  const [rangeAddress, rangePrefix] = cidr.split('/')
  const rangeValue = parseIpv4Address(rangeAddress)
  const prefix = Number(rangePrefix)
  const hasInvalidAddress = addressValue === null
  const hasInvalidRangeAddress = rangeValue === null
  const hasInvalidPrefix = !Number.isInteger(prefix)
  const hasInvalidRange = hasInvalidAddress || hasInvalidRangeAddress || hasInvalidPrefix

  if (hasInvalidRange) return false

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0

  return (addressValue & mask) === (rangeValue & mask)
}

const isPrivateIpv4Address = (address: string) =>
  MESSAGE_LINK_PREVIEW_PRIVATE_IPV4_CIDRS.some((cidr) => isIpv4AddressInCidr(address, cidr))

const isPrivateIpv6Address = (address: string) => {
  const normalizedAddress = address.toLowerCase()
  const mappedIpv4Address = normalizedAddress.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/u)?.[1]

  if (mappedIpv4Address) return isPrivateIpv4Address(mappedIpv4Address)

  const hasExactPrivateAddress = MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_EXACT_ADDRESSES.some(
    (address) => address === normalizedAddress
  )
  const hasPrivatePrefix = MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_PREFIXES.some((prefix) =>
    normalizedAddress.startsWith(prefix)
  )

  return hasExactPrivateAddress || hasPrivatePrefix
}

const isPrivateAddress = (address: string) => {
  const ipVersion = isIP(address)

  if (ipVersion === 4) return isPrivateIpv4Address(address)
  if (ipVersion === 6) return isPrivateIpv6Address(address)

  return true
}

const resolveMessageLinkPreviewAddresses = async (hostname: string): Promise<LookupAddress[] | null> => {
  const addresses = await lookup(hostname, { all: true, verbatim: false })
  const hasPrivateAddress = addresses.some(({ address }) => isPrivateAddress(address))

  if (!addresses.length || hasPrivateAddress) return null

  return addresses
}

export const createMessageLinkPreviewLookup = (): LookupFunction => (hostname, options, callback) => {
  void resolveMessageLinkPreviewAddresses(hostname)
    .then((addresses) => {
      if (!addresses) {
        callback(new Error('Blocked link preview address'), '', 0)

        return
      }

      if (options.all) {
        callback(null, addresses)

        return
      }

      const [address] = addresses

      callback(null, address.address, address.family)
    })
    .catch((error: Error) => {
      callback(error, '', 0)
    })
}
