import { Menu, MenuItem } from 'electron';
import { QjMenuItem } from '../../common/electron';

export function buildContextMenu(template: ReadonlyArray<QjMenuItem>, onClick: (ix: number, item: QjMenuItem) => void): Menu {
  const menuItems = new Array<MenuItem>();

  for (let index = 0; index < template.length; index++) {
    const item: QjMenuItem = template[index];
    menuItems.push(
      new MenuItem({
        label: item.label,
        type: item.type,
        enabled: item.enabled,
        role: item.role,
        click: () => onClick(index, item)
      })
    );
  }

  const menu = new Menu();
  menuItems.forEach((x) => menu.append(x));
  return menu;
}
