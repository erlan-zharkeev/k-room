import { useEffect } from 'react'

import { SocketActionsType } from 'common'

import { transformRoomData, useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'
import { FChatRoomType } from 'src/shared/config'

export const useChatRoomUpdateMonitor = () => {
  const { mergeMany, put } = useChatRoom()

  const actualizeChatRooms = async (chatRooms: FChatRoomType[]) => {
    const rooms = chatRooms.map((room) => transformRoomData(room))

    await mergeMany(rooms, {
      merge: (_current, incoming) => incoming,
      removeMissing: true
    })
  }

  const handleRoomAddition = async (room: FChatRoomType) => {
    await put(transformRoomData(room))
  }

  useEffect(() => {
    socket.on<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
    socket.on<SocketActionsType>('new-room-added', handleRoomAddition)

    return () => {
      socket.off<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
      socket.off<SocketActionsType>('new-room-added', handleRoomAddition)
    }
  }, [mergeMany, put])
}
