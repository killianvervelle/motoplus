import fs from "fs";
import path from "path";
import { MENU_ITEMS } from "./constants";

// 🧩 Define interfaces matching your structure
interface MenuChild {
  name: string;
  slug: string;
  submenu?: MenuChild[];
}

interface MenuItem {
  name: string;
  slug: string;
  kind?: string;
  imageBlack?: string;
  imageWhite?: string;
  submenu?: MenuChild[];
}

// ✅ Recursive sort with explicit type annotation
function sortMenuItems(menus: MenuChild[]): MenuChild[] {
  return menus
    .map((menu): MenuChild => ({
      ...menu,
      submenu: menu.submenu ? sortMenuItems(menu.submenu) : undefined,
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
}

// ✅ Sort the data
const sorted: MenuItem[] = MENU_ITEMS.map((menu): MenuItem => ({
  ...menu,
  submenu: menu.submenu ? sortMenuItems(menu.submenu) : undefined,
}));

// ✅ Write to JSON file (or overwrite your existing file)
const outputPath = path.resolve(__dirname, "sortedMenuItems.json");
fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2), "utf8");

console.log("✅ Menu sorted and saved to:", outputPath);
