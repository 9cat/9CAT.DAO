package peer

import (
	"log"
	"net/http"
	"path/filepath"

	factory "github.com/9cat/9CAT.DAO/projects/peer/factory"
	"github.com/gin-contrib/multitemplate"
	gin "github.com/gin-gonic/gin"
	websocket "github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (e *Peer) startWebServer() {

	r := gin.Default()
	// r.Use(cors.Default())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
	// 	"temple": "9cat!",
	// }))

	r.Static("/assets", "./projects/peer/templates/assets")
	r.HTMLRender = loadTemplates("./projects/peer/templates")

	//主页进入
	// authorized.GET("/", func(c *gin.Context) {
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl.html", gin.H{
			"menulist": factory.MakeMenu(),
		})
	})

	r.Run(":19099") // listen and serve on 0.0.0.0:

}

func loadTemplates(templatesDir string) multitemplate.Renderer {
	r := multitemplate.NewRenderer()

	layouts, err := filepath.Glob(templatesDir + "/layouts/*.tmpl.html")
	if err != nil {
		panic(err.Error())
	}
	log.Printf("%#v", layouts)

	includes, err := filepath.Glob(templatesDir + "/*.tmpl.html")
	if err != nil {
		panic(err.Error())
	}

	// Generate our templates map from our layouts/ and includes/ directories
	for _, include := range includes {
		layoutCopy := make([]string, len(layouts))
		copy(layoutCopy, layouts)
		files := append(layoutCopy, include)
		log.Printf("%#v", include)
		r.AddFromFiles(filepath.Base(include), files...)
	}
	return r
}
