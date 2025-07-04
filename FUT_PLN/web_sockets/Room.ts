import { OutgoingMessage } from "./types";
import type { User } from "./User";

export class Room {
  rooms: Map<string, User[]> = new Map();
  static instance: Room;
  private constructor() {
    this.rooms = new Map();
  }
  //singleton , so that we have all the state in a single page so that we dont have to re intiitalize again and again

  static getInstance() {
    if (!this.instance) {
      this.instance = new Room();
    }
    return this.instance;
  }
  
  public removeUser(user: User, spaceId: string) {
    if (!this.rooms.has(spaceId)) {
      return;
    }
   this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter((u) => u.id !== user.id) ?? []));
  }

  public addUser(spaceId: string, user: User) {
    if (!this.rooms.has(spaceId)) {
      this.rooms.set(spaceId, [user]);
      return;
    }

    this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
  }

  public broadcast(message: OutgoingMessage, user: User, roomId: string) {
    if (!this.rooms.has(roomId)) {
      return;
    }
    this.rooms.get(roomId)?.forEach((o) => {
      if (o.id !== user.id) {
        o.send(message);
      }
    });
  }
}