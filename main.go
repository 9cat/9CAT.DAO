package main

import (
	"fmt"
	"log"
	"os"

	peer "github.com/9cat/9CAT.DAO/projects/peer"
	ishell "github.com/abiosoft/ishell"
	utils "github.com/bitontop/gored/utils"
)

var GitCommit string

func main() {

	log.SetFlags(log.LstdFlags | log.Llongfile)
	if len(GitCommit) > 8 {
		log.Printf("GIT Version:%s", GitCommit[0:8])
		// conf.GitCommit = GitCommit
	}

	ip, err := utils.GetOutboundIP()
	if err == nil {
		//TODO
	}

	welcome := fmt.Sprintf("9CAT.DAO - Console  %s  ", ip)
	log.Printf("\x1b[31;1m  START: %s  \x1b[0m \n", welcome)

	if len(os.Args) > 1 {
		arg := os.Args[1]
		switch arg {

		case "ecrecover":
			go peer.Create().ECRecover()
			break

		case "peer":
			go peer.Create().Run()
			break

		default:
			go peer.Create().Run()
			break
		}

	} else {
		log.Printf("no param: peer   ")
	}

	iShell()

}

func iShell() {
	// create new shell.
	// by default, new shell includes 'exit', 'help' and 'clear' commands.
	shell := ishell.New()
	shell.SetHomeHistoryPath(".ishell_history")
	// display welcome info.
	shell.Println("C.A. Interactive Shell")
	shell.Run()
}
