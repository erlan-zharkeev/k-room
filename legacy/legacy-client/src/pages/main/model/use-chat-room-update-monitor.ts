import { useEffect } from 'react'

import { SocketActions } from 'common'

import { transformRoomData, useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'
import { FChatRoom } from 'src/shared/config'

export const useChatRoomUpdateMonitor = () => {
  const { mergeMany, put } = useChatRoom()

  const actualizeChatRooms = async (chatRooms: FChatRoom[]) => {
    const rooms = chatRooms.map((room) => transformRoomData(room))

    await mergeMany(rooms, {
      merge: (_current, incoming) => incoming,
      removeMissing: true
    })
  }

  const handleRoomAddition = async (room: FChatRoom) => {
    await put(transformRoomData(room))
  }

  useEffect(() => {
    socket.on<SocketActions>('actual-chat-rooms', actualizeChatRooms)
    socket.on<SocketActions>('new-room-added', handleRoomAddition)

    return () => {
      socket.off<SocketActions>('actual-chat-rooms', actualizeChatRooms)
      socket.off<SocketActions>('new-room-added', handleRoomAddition)
    }
  }, [mergeMany, put])
}
