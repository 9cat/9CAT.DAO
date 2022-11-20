package peer

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"

	factory "github.com/9cat/9CAT.DAO/projects/peer/factory"
	"github.com/bitontop/gored/utils"
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

	//!--- api

	//主页进入
	r.POST("/session", func(c *gin.Context) { //https://master.9cat.work/session
		// var str string
		var err error

		data, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			log.Print(err)
			c.JSON(500, struct{}{})
			return
		}

		httpClient := &http.Client{}
		httpPost := &utils.HttpPost{
			URI:         "https://master.9cat.work/session", // internal data verification
			RequestBody: data,
		}

		// str = fmt.Sprintf("RequestBody:: %s", httpPost.RequestBody[:2000])
		// log.Print(str)

		httpPost.Request, httpPost.Error = http.NewRequest("POST", httpPost.URI, bytes.NewBuffer(httpPost.RequestBody))
		if nil != httpPost.Error {
			c.JSON(500, struct{}{})
			return
		}
		httpPost.Request.Header.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36")
		httpPost.Request.Header.Add("Content-Type", "multipart/form-data")

		httpPost.Response, httpPost.Error = httpClient.Do(httpPost.Request)
		if nil != httpPost.Error {
			c.JSON(500, struct{}{})
			return
		}
		defer httpPost.Response.Body.Close()
		httpPost.StatusCode = httpPost.Response.StatusCode
		httpPost.ResponseBody, httpPost.Error = ioutil.ReadAll(httpPost.Response.Body)
		if nil != httpPost.Error {
			c.JSON(500, struct{}{})
			return
		}

		// str = fmt.Sprintf("%s", httpPost.ResponseBody)
		// log.Print(str)

		c.Data(200, "application/json", httpPost.ResponseBody)
	})

	r.Run(":23981") // listen and serve on 0.0.0.0:

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
