export type NavItem = NavItemWithLink | NavItemWithChildren;
export interface NavItemChildren {
  text?: string;
  items: NavItemWithLink[];
}

export interface NavItemWithChildren {
  text?: string;
  items: (NavItemChildren | NavItemWithLink)[];

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string;
}

export interface NavItemWithLink {
  text: string;
  link: string;
  items?: never;

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string;
  rel?: string;
  target?: string;
}

export type Sidebar = SidebarItem[] | SidebarMulti;

export interface SidebarMulti {
  [path: string]: SidebarItem[];
}

export type SidebarItem = {
  /**
   * 侧边栏项的文本标签
   */
  text?: string;

  /**
   * 侧边栏项的链接
   */
  link?: string;

  /**
   * 侧边栏项的子项
   */
  items?: SidebarItem[];

  /**
   * 如果未指定，侧边栏组不可折叠
   *
   * 如果为 `true`，则侧边栏组可折叠并且默认折叠
   *
   * 如果为 `false`，则侧边栏组可折叠但默认展开
   */
  collapsed?: boolean;
};
