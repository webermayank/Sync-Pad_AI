import { JWT_PASSWORD } from "./config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocket } from "ws";
import { Room } from "./Room";
import { OutgoingMessage } from "./types";
import client from "@laceverse/db/client";

function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export class User {
  public id: string;
  private spaceId?: string;
  private userId?: string;
  private x: number;
  private y: number;
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.id = getRandomString(10);
    this.x = 0;
    this.y = 0;
    this.ws = ws;
    this.initHandlers();
  } // decalse and this.ws =ws aslo done

  initHandlers() {
    this.ws.on("message", async (data) => {
      console.log(data)
      const parsedData = JSON.parse(data.toString());
      console.log("0--0-0-0-0-0-0-0-0-0-0-0-0-0-0-")
      console.log(parsedData);
      switch (parsedData.type) {
        case "join":
          console.log("joined success");
          const spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;
          console.log("token")
          console.log(token)
          const userId = (jwt.verify(token, JWT_PASSWORD) as JwtPayload).userId;
          
          if (!userId) {
            this.ws.close();
            return;
          }
          this.userId = userId;
          const space = await client.space.findFirst({
            where: { id: spaceId },
          });
          if (!space) {
            this.ws.close();
            return;
          }
          this.spaceId = spaceId;
          Room.getInstance().addUser(spaceId, this);
          this.x = Math.floor(Math.random() * space?.width);
          this.y = Math.floor(Math.random() * space?.height);

          this.send({
            type: "space-joined",
            payload: {
              spawn: {
                x: this.x,
                y: this.y,
              },
              users:
                Room.getInstance()
                  .rooms.get(spaceId)
                  ?.filter(x=>x.id !== this.id)?.map((u) => ({ id: u.id })) ?? [],
            },
          });
          Room.getInstance().broadcast(
            {
              type: "user-joined",
              payload: {
                userId: this.userId,
                x: this.x,
                y: this.y,
              },
            },
            this,
            this.spaceId!
          );
          break;
        case "move":
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;
          const xDisp = Math.abs(this.x - moveX);
          const yDisp = Math.abs(this.y - moveY);
          if ((xDisp == 1 && yDisp == 0) || (xDisp == 0 && yDisp == 1)) {
            this.x = moveX;
            this.y = moveY;
            Room.getInstance().broadcast(
              {
                type: "movement",
                payload: {
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId!
            );
          }
          this.send({
            type: "movement-rejected",
            payload: {
              x: this.x,
              y: this.y,
            },
          });
      }
    });
  }

  destroy() {
    Room.getInstance().broadcast(
      {
        type: "user-left",
        payload: {
          userId: this.userId,
        },
      },
      this,
      this.spaceId!
    );
    Room.getInstance().removeUser(this, this.spaceId!);
  }

  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
}
