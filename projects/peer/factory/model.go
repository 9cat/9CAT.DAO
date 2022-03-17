package factory

//MenuEntry the entry of menu

type MenuEntry struct {
	ID      string
	Name    string
	Icon    string
	Style   string
	SubMenu []*SubMenu
}

type SubMenu struct {
	Href  string
	Title string
}
