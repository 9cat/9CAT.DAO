package peer

// Copyright 2012-2022 9CAT Devlopment Team. All rights reserved.
// license that can be found in the LICENSE file.

import (
	"log"
	"sync"
)

var instance *Peer
var once sync.Once

type Peer struct {
	// TG *telegram.Telegram
	// db *gorm.DB
}

//Create is an instance
func Create() *Peer {
	log.Printf("create Peer Instance.....")
	once.Do(func() {
		instance = &Peer{}
		instance.init()
	})

	return instance
}

func (e *Peer) init() error {
	log.SetFlags(log.LstdFlags | log.Llongfile)

	log.Printf("init .....")
	return nil
}

func (e *Peer) Run() error {

	e.startWebServer()
	return nil
}
