import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { createClient, type RedisClientType } from 'redis'

import { SERVER_ENV } from 'src/app/env'
import { log } from 'src/shared/lib/log'

import type { RedisAdapterClients, RedisCommandClient } from './security.types'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null
  private connectionPromise: Promise<RedisClientType> | null = null
  private readonly adapterClients: RedisClientType[] = []

  async onModuleInit() {
    await this.connectClient()
  }

  async onModuleDestroy() {
    await Promise.all(this.adapterClients.map(async (client) => client.quit()))

    if (!this.client) {
      return
    }

    await this.client.quit()
  }

  private async connectClient() {
    const { redisUrl } = SERVER_ENV.security

    if (!redisUrl) {
      throw new Error('REDIS_URL is required')
    }

    if (this.client?.isOpen) {
      return this.client
    }

    if (!this.connectionPromise) {
      this.client = createClient({ url: redisUrl })
      this.client.on('error', (error) => {
        log.error(`-Redis error: ${error instanceof Error ? error.message : String(error)}`)
      })

      this.connectionPromise = this.client.connect().then(() => {
        if (!this.client) {
          throw new Error('Redis client was not created')
        }

        log.success('-Redis connected')
        return this.client
      })
    }

    return this.connectionPromise
  }

  private async clientOrThrow() {
    return this.connectClient()
  }

  async createAdapterClients(): Promise<RedisAdapterClients> {
    const client = await this.clientOrThrow()
    const publishClient = client.duplicate()
    const subscribeClient = client.duplicate()

    publishClient.on('error', (error) => {
      log.error(`-Redis adapter publish client error: ${error instanceof Error ? error.message : String(error)}`)
    })
    subscribeClient.on('error', (error) => {
      log.error(`-Redis adapter subscribe client error: ${error instanceof Error ? error.message : String(error)}`)
    })

    await Promise.all([publishClient.connect(), subscribeClient.connect()])
    this.adapterClients.push(publishClient, subscribeClient)

    return { publishClient, subscribeClient }
  }

  async read(key: string) {
    return (await this.clientOrThrow()).get(key)
  }

  async readMany(keys: string[]) {
    if (keys.length === 0) {
      return []
    }

    return (await this.clientOrThrow()).mGet(keys)
  }

  async readNumber(key: string) {
    const value = await this.read(key)

    return value ? Number(value) : 0
  }

  async ttlMs(key: string) {
    const ttlMs = await (await this.clientOrThrow()).pTTL(key)

    return ttlMs > 0 ? ttlMs : 0
  }

  async increment(key: string, ttlMs: number) {
    const client = await this.clientOrThrow()
    const count = await client.incr(key)

    if (count === 1) {
      await client.pExpire(key, ttlMs)
    }

    return count
  }

  async write(key: string, value: string, ttlMs: number) {
    await (await this.clientOrThrow()).set(key, value, { PX: ttlMs })
  }

  async writeOnce(key: string, value: string, ttlMs: number) {
    const result = await (await this.clientOrThrow()).set(key, value, { PX: ttlMs, NX: true })

    return result === 'OK'
  }

  async remove(key: string) {
    await (await this.clientOrThrow()).del(key)
  }

  async removeMany(keys: string[]) {
    if (keys.length === 0) {
      return
    }

    await (await this.clientOrThrow()).del(keys)
  }

  async runCommand(command: string[]) {
    const client = (await this.clientOrThrow()) as unknown as RedisCommandClient

    return client.sendCommand(command)
  }

  async addSetValue(key: string, value: string) {
    await (await this.clientOrThrow()).sAdd(key, value)
  }

  async isSetValueExists(key: string, value: string) {
    return Boolean(await (await this.clientOrThrow()).sIsMember(key, value))
  }

  async removeSetValue(key: string, value: string) {
    await (await this.clientOrThrow()).sRem(key, value)
  }

  async readSetValues(key: string) {
    return (await this.clientOrThrow()).sMembers(key)
  }

  async refreshTtl(key: string, ttlMs: number) {
    await (await this.clientOrThrow()).pExpire(key, ttlMs)
  }
}
