import { randomUUID } from 'crypto'

import { Injectable, OnModuleDestroy } from '@nestjs/common'
import type { IEventStatusContact } from 'global-shared'

import { log } from 'src/shared/lib/log'
import type { MongoIdType } from 'src/shared/types/mongo'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { RedisService } from '../security/redis.service'
import { UserModel } from '../user/user.model'

import {
  PRESENCE_REFRESH_INTERVAL_MS,
  PRESENCE_OFFLINE_LOCK_TTL_MS,
  PRESENCE_ONLINE_USERS_KEY,
  PRESENCE_REDIS_KEY_PREFIX,
  PRESENCE_SOCKET_TTL_MS,
  PRESENCE_SWEEP_INTERVAL_MS,
  PRESENCE_USER_SET_TTL_MS
} from './constants'
import { buildUserRoomName, emitToUsers } from './presence.utils'

@Injectable()
export class PresenceService implements OnModuleDestroy {
  private readonly refreshTimers = new Map<string, ReturnType<typeof setInterval>>()
  private sweepTimer: ReturnType<typeof setInterval> | null = null

  constructor(private readonly redisService: RedisService) {}

  startPresenceMonitoring() {
    this.startPresenceSweep()
  }

  onModuleDestroy() {
    this.stopPresenceSweep()
    this.refreshTimers.forEach((timer) => clearInterval(timer))
    this.refreshTimers.clear()
  }

  private buildUserSocketsKey(userId: MongoIdType | string) {
    return [PRESENCE_REDIS_KEY_PREFIX, 'user', String(userId), 'sockets'].join(':')
  }

  private buildSocketUserKey(socketId: string) {
    return [PRESENCE_REDIS_KEY_PREFIX, 'socket', socketId].join(':')
  }

  private buildOfflineLockKey(userId: MongoIdType | string) {
    return [PRESENCE_REDIS_KEY_PREFIX, 'offline-lock', String(userId)].join(':')
  }

  private async joinUserSocketRoom(socket: SocketInstanceType) {
    await socket.join(buildUserRoomName(socket.data.userId))
  }

  private startPresenceSweep() {
    this.stopPresenceSweep()

    void this.sweepOfflineUsers().catch((error) => {
      log.error(`-Presence sweep failed: ${error instanceof Error ? error.message : String(error)}`)
    })
    this.sweepTimer = setInterval(() => {
      void this.sweepOfflineUsers().catch((error) => {
        log.error(`-Presence sweep failed: ${error instanceof Error ? error.message : String(error)}`)
      })
    }, PRESENCE_SWEEP_INTERVAL_MS)
  }

  private stopPresenceSweep() {
    if (!this.sweepTimer) {
      return
    }

    clearInterval(this.sweepTimer)
    this.sweepTimer = null
  }

  private async refreshSocketPresence(socketId: string, userId: string) {
    await Promise.all([
      this.redisService.write(this.buildSocketUserKey(socketId), userId, PRESENCE_SOCKET_TTL_MS),
      this.redisService.refreshTtl(this.buildUserSocketsKey(userId), PRESENCE_USER_SET_TTL_MS)
    ])
  }

  private startPresenceRefresh(socket: SocketInstanceType) {
    this.stopPresenceRefresh(socket.id)

    const timer = setInterval(() => {
      void this.refreshSocketPresence(socket.id, socket.data.userId).catch((error) => {
        log.error(`-Presence refresh failed: ${error instanceof Error ? error.message : String(error)}`)
      })
    }, PRESENCE_REFRESH_INTERVAL_MS)

    this.refreshTimers.set(socket.id, timer)
  }

  private stopPresenceRefresh(socketId: string) {
    const timer = this.refreshTimers.get(socketId)

    if (!timer) {
      return
    }

    clearInterval(timer)
    this.refreshTimers.delete(socketId)
  }

  private async activeSocketIdsByUser(userId: string) {
    const userSocketsKey = this.buildUserSocketsKey(userId)
    const socketIds = await this.redisService.readSetValues(userSocketsKey)
    const aliveSocketIds: string[] = []

    await Promise.all(
      socketIds.map(async (socketId) => {
        const socketUserId = await this.redisService.read(this.buildSocketUserKey(socketId))

        if (socketUserId === userId) {
          aliveSocketIds.push(socketId)
          return
        }

        await this.redisService.removeSetValue(userSocketsKey, socketId)
      })
    )

    return aliveSocketIds
  }

  async isUserOnline(userId: MongoIdType | string) {
    return (await this.activeSocketIdsByUser(String(userId))).length > 0
  }

  async onlineMapByUserIds(userIds: Array<MongoIdType | string>) {
    const uniqueUserIds = [...new Set(userIds.map((userId) => String(userId)))]
    const result = new Map<string, boolean>()

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        result.set(userId, await this.isUserOnline(userId))
      })
    )

    return result
  }

  private async emitContactStatus(userId: string, online: boolean, lastSeen?: number) {
    const users = await UserModel.find({ [`personal.contacts.${userId}`]: { $exists: true } }, { _id: 1 }).lean()

    if (!users.length) {
      return
    }

    const payload: IEventStatusContact = {
      interlocutorId: userId,
      online,
      onlineStatusUpdatedTimestamp: Date.now(),
      lastSeen
    }

    emitToUsers(
      users.map((user) => user._id),
      'contact-status-updated',
      payload
    )
  }

  private async markUserOffline(userId: string) {
    const lockKey = this.buildOfflineLockKey(userId)
    const lockValue = randomUUID()
    const lockAcquired = await this.redisService.writeOnce(lockKey, lockValue, PRESENCE_OFFLINE_LOCK_TTL_MS)

    if (!lockAcquired || (await this.isUserOnline(userId))) {
      return
    }

    const lastSeen = Date.now()

    if ((await this.redisService.read(lockKey)) !== lockValue || (await this.isUserOnline(userId))) {
      return
    }

    await this.redisService.removeSetValue(PRESENCE_ONLINE_USERS_KEY, userId)
    await UserModel.updateOne({ _id: userId }, { $set: { 'public.lastSeen': lastSeen } })
    await this.emitContactStatus(userId, false, lastSeen)
  }

  private async sweepOfflineUsers() {
    const userIds = await this.redisService.readSetValues(PRESENCE_ONLINE_USERS_KEY)

    await Promise.all(
      userIds.map(async (userId) => {
        if (await this.isUserOnline(userId)) {
          return
        }

        await this.markUserOffline(userId)
      })
    )
  }

  async markSocketConnected(socket: SocketInstanceType) {
    const { userId } = socket.data
    const wasOnline = await this.isUserOnline(userId)

    await this.joinUserSocketRoom(socket)
    await this.redisService.remove(this.buildOfflineLockKey(userId))
    await this.redisService.addSetValue(PRESENCE_ONLINE_USERS_KEY, userId)
    await this.redisService.addSetValue(this.buildUserSocketsKey(userId), socket.id)
    await this.refreshSocketPresence(socket.id, userId)
    this.startPresenceRefresh(socket)

    if (!wasOnline) {
      await this.emitContactStatus(userId, true)
    }
  }

  async markSocketDisconnected(socket: SocketInstanceType) {
    const { userId } = socket.data

    this.stopPresenceRefresh(socket.id)
    await Promise.all([
      this.redisService.removeSetValue(this.buildUserSocketsKey(userId), socket.id),
      this.redisService.remove(this.buildSocketUserKey(socket.id))
    ])

    if (await this.isUserOnline(userId)) {
      return
    }

    await this.markUserOffline(userId)
  }
}
