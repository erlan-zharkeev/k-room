import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { createClient, type RedisClientType } from 'redis'

import { SERVER_ENV } from 'src/app/env'
import { log } from 'src/shared/lib/log'

import type { IRedisMemoryValue } from './types'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType | null = null
  private readonly memoryStore = new Map<string, IRedisMemoryValue>()
  private redisAvailable = false

  async onModuleInit() {
    const { redisUrl } = SERVER_ENV.security

    if (!redisUrl) {
      return
    }

    try {
      this.client = createClient({ url: redisUrl })
      this.client.on('error', (error) => {
        log.error(`-Redis error: ${error instanceof Error ? error.message : String(error)}`)
      })
      await this.client.connect()
      this.redisAvailable = true
      log.success('-Redis connected')
    } catch (error) {
      this.client = null
      this.redisAvailable = false

      if (!SERVER_ENV.isDev) {
        throw error
      }

      log.warn(
        `-Redis unavailable. Falling back to memory store: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  async onModuleDestroy() {
    if (!this.client) {
      return
    }

    await this.client.quit()
  }

  private getMemoryValue(key: string) {
    const current = this.memoryStore.get(key)

    if (!current) {
      return null
    }

    if (Date.now() >= current.expiresAt) {
      this.memoryStore.delete(key)
      return null
    }

    return current
  }

  private setMemoryValue(key: string, value: string, ttlMs: number) {
    this.memoryStore.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    })
  }

  isRedisAvailable() {
    return this.redisAvailable
  }

  async get(key: string) {
    if (this.client && this.redisAvailable) {
      return this.client.get(key)
    }

    return this.getMemoryValue(key)?.value ?? null
  }

  async getNumber(key: string) {
    const value = await this.get(key)

    return value ? Number(value) : 0
  }

  async getTtlMs(key: string) {
    if (this.client && this.redisAvailable) {
      const ttlMs = await this.client.pTTL(key)

      return ttlMs > 0 ? ttlMs : 0
    }

    const current = this.getMemoryValue(key)

    return current ? Math.max(current.expiresAt - Date.now(), 0) : 0
  }

  async increment(key: string, ttlMs: number) {
    if (this.client && this.redisAvailable) {
      const count = await this.client.incr(key)

      if (count === 1) {
        await this.client.pExpire(key, ttlMs)
      }

      return count
    }

    const current = this.getMemoryValue(key)
    const nextValue = String((current ? Number(current.value) : 0) + 1)

    this.setMemoryValue(key, nextValue, current ? current.expiresAt - Date.now() : ttlMs)

    return Number(nextValue)
  }

  async set(key: string, value: string, ttlMs: number) {
    if (this.client && this.redisAvailable) {
      await this.client.set(key, value, { PX: ttlMs })
      return
    }

    this.setMemoryValue(key, value, ttlMs)
  }

  async delete(key: string) {
    if (this.client && this.redisAvailable) {
      await this.client.del(key)
      return
    }

    this.memoryStore.delete(key)
  }
}
