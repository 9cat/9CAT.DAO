package peer

// Copyright 2012-2023 9CAT Devlopment Team. All rights reserved.
// license that can be found in the LICENSE file.

import (
	"encoding/hex"
	"fmt"
	"log"
	"sync"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

var instance *Peer
var once sync.Once

type Peer struct {
	// TG *telegram.Telegram
	// db *gorm.DB
}

// Create is an instance
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

func (e *Peer) ECRecover() error {

	var str string
	var err error

	message := "\u0019Ethereum Signed Message:\n13Cryptokitties"

	data := []byte(message)
	data = []byte(hexutil.Encode(data))
	hash := crypto.Keccak256Hash(data)

	s := "c70678efc3aa4d7d108d0fb2351fb7aa4f42123612dd76f5a49843b6aebbda2d12f9b590ac73c50bd9c8c3bcd2f9fbfc54b199adf29ee88ff51f852c53f521601b"
	signature, err := hex.DecodeString(s)
	if err != nil {
		// log.Fatal(err)

		str = fmt.Sprintf("DecodeString err:: %s", err)
		log.Print(str)
		return err

	} else {
		str = fmt.Sprintf("DecodeString %x", signature)
		log.Print(str)
	}

	sigPublicKey, err := crypto.Ecrecover(hash.Bytes(), signature)
	if err != nil {
		// log.Fatal(err)

		str = fmt.Sprintf("sigPublicKey err:: %s", err)
		log.Print(str)
		return err

	}

	str = fmt.Sprintf("sigPublicKey :: %s", sigPublicKey)
	log.Print(str)

	return err
}
