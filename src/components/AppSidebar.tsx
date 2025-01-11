import { /*Calendar,*/ Home, LibraryBig, /*Settings,*/ UsersRound, Key } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { TRANSLATIONS } from "@/lib/translations";

// Menu items.
const items = [
  {
    title: TRANSLATIONS.pt.home,
    url: "/",
    icon: Home
  },
  {
    title: TRANSLATIONS.pt.authors,
    url: "/authors",
    icon: UsersRound
  },
  {
    title: TRANSLATIONS.pt.songs,
    url: "/songs",
    icon: LibraryBig
  },
  // {
  //   title: "Calendar",
  //   url: "#",
  //   icon: Calendar
  // },
  {
    title: TRANSLATIONS.pt.admin,
    url: "/admin",
    icon: Key
  }
  // {
  //   title: TRANSLATIONS.pt.settings,
  //   url: "#",
  //   icon: Settings
  // }
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Canticum Bibliothecam</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
