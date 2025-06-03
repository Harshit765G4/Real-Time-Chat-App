
export type UserId = string;

export interface Chat{
    id: string; 
    userId: UserId;
    name: string;
    message: string;
    upvotes: UserId[];
}

export abstract class Store{
    constructor() {

    }
    initRoom(roomId: string) {
        // Initialize a room with the given roomId
        // This could involve setting up a new data structure to hold chats
        // and any other necessary metadata for the room.

    }

    getChats(room: string, limit: number, offset: number) {

    }

    addChat(userId: UserId, name: string, room: string, message: string, limit: number, offset: number) {

    }

    upvote(userId: UserId, room: string, chatId: string) {
        // Logic to upvote a chat message
    }
}