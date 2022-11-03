package factory

// MakeMenu : make menu template string
func MakeMenu() []*MenuEntry {

	var menuList []*MenuEntry

	var researchToolSub []*SubMenu

	//!--研究工具
	//-子目录

	//--子目录
	researchToolSub = append(researchToolSub, &SubMenu{
		Href:  "https://www.meetup.com/9catnet/",
		Title: "线下聚会(Meetup.com)",
	})

	researchToolSub = append(researchToolSub, &SubMenu{
		Href:  "https://www.9cat.net",
		Title: "官方网站",
	})

	//主目录
	researchTool := &MenuEntry{
		Icon:    "fas fa-search-dollar",
		Style:   "color: darkblue",
		Name:    "了解我们",
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
