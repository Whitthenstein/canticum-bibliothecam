import { /*Calendar,*/ Home, LibraryBig, /*Settings,*/ UsersRound, Key } from "lucide-react";
import {getTranslations} from 'next-intl/server';


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import LocaleSwitcher from "./LocaleSwitcher";

export async function AppSidebar() {
  const t = await getTranslations();

  // Menu items.
const items = [
  {
    title: t("home"),
    url: "/",
    icon: Home
  },
  {
    title: t("authors"),
    url: "/authors",
    icon: UsersRound
  },
  {
    title: t("songs"),
    url: "/songs",
    icon: LibraryBig
  },
  // {
  //   title: "Calendar",
  //   url: "#",
  //   icon: Calendar
  // },
  {
    title: t("admin"),
    url: "/admin",
    icon: Key
  }
  // {
  //   title: settings,
  //   url: "#",
  //   icon: Settings
  // }
];

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
      <SidebarFooter>
        <LocaleSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
