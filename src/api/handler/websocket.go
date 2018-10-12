// Copyright 2018 Naftis Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/xiaomi/naftis/src/api/executor"
	"github.com/xiaomi/naftis/src/api/log"
	"github.com/xiaomi/naftis/src/api/util"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Client handles connection and the hub.
type Client struct {
	name  string
	hub   *Hub
	conn  *websocket.Conn
	send  chan []byte
	close chan bool
}

func (c *Client) read() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	taskCh := executor.GetOrAddTaskStatusChM(c.name)
	go func() {
	L:
		for {
			select {
			case t := <-taskCh:
				rett, _ := json.Marshal(t)
				log.Info("[getTaskStatus] emit succ", "user", c.name, "room", t.Operator)
				c.hub.broadcast <- Message{toClients: []*Client{c}, content: rett}
			case <-c.close:
				break L
			}
		}
	}()

	for {
		_, _, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Info("[WS] websocket closed", "error", err)
			}
			break
		}
	}
}

func (c *Client) write() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			w.Write(message)
			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// ServeWS serves a websocket server.
// TODO improve authentication
func ServeWS(hub *Hub, w http.ResponseWriter, r *http.Request) {
	u, e := util.Authentication(r)
	if e != nil || u.Name == "" {
		log.Info("[WS] websocket authenticate failed", "error", e, "user", u)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	conn, e := upgrader.Upgrade(w, r, nil)
	if e != nil {
		log.Info("[WS] websocket upgrade failed", "error", e)
		return
	}

	client := &Client{name: u.Name, hub: hub, conn: conn, send: make(chan []byte, 256), close: make(chan bool, 1)}
	client.hub.register <- client

	go client.write()
	go client.read()
}

// Hub maintains the set of active clients and broadcasts messages to specific clients.
type Hub struct {
	clients    map[*Client]bool
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
}

// Message contains message content and message receiver
type Message struct {
	toClients []*Client
	content   []byte
}

// NewHub constructs a hub instance.
func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

// Run starts hub.
func (h *Hub) Run() {
	for {
		select {
		case c := <-h.register:
			h.clients[c] = true
		case c := <-h.unregister:
			if _, ok := h.clients[c]; ok {
				delete(h.clients, c)
				c.close <- true
				close(c.send)
			}
		case message := <-h.broadcast:
			for _, c := range message.toClients {
				if _, ok := h.clients[c]; ok {
					c.send <- message.content
				}
			}
		}
	}
}
