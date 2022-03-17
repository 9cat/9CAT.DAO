package factory

//MakeMenu : make menu template string
func MakeMenu() []*MenuEntry {

	var menuList []*MenuEntry

	var researchToolSub []*SubMenu

	//!--研究工具
	//-子目录

	//--子目录
	researchToolSub = append(researchToolSub, &SubMenu{
		Href:  "/research.trace",
		Title: "跟踪寻迹",
	})

	researchToolSub = append(researchToolSub, &SubMenu{
		Href:  "/research.tools",
		Title: "分析工具",
	})

	//主目录
	researchTool := &MenuEntry{
		Icon:    "fas fa-search-dollar",
		Style:   "color: darkblue",
		Name:    "研究工具",
		ID:      "research_tool",
		SubMenu: researchToolSub,
	}

	menuList = append(menuList, researchTool)

	//!-- //XXXX 主目录
	// defiData := &MenuEntry{
	// 	Icon:    "ti-layout-grid3",
	// 	Name:    "DeFi Tools",
	// 	SubMenu: defiSub,
	// }
	// menuList = append(menuList, defiData)
	// defiSub = append(defiSub, &SubMenu{
	// 	Href:  "/basic",
	// 	Title: "Basic",
	// })

	//!-----------------------------------------

	// log.Printf("%#v", menuList)

	return menuList
}
