// Application config (tùy chọn)
// Application config (tùy chọn)
export const APP_CONFIG = () =>
  ({
    permissions: {
      Created: 'Created', // 1
      Read: 'Read', // 2
      Updated: 'Updated', // 3
      Deleted: 'Deleted', // 4
      Imported: 'Imported', // 5
      Exported: 'Exported', // 6
      Restore: 'Restore', // 7
      EmptyTrash: 'EmptyTrash', // 8
      EmptyTrashAll: 'EmptyTrashAll', // 9
    },
    pages: {
      Users: 'Users', // 1
      Media: 'Media', // 2
      Roles: 'Roles', // 3
      Pages: 'Pages', // 4
      Permissions: 'Permissions', // 5
    },
    roles: {
      Admin: 'Admin', // 1
      User: 'User', // 2
      manager: 'manager', // 3
      editor: 'editor', // 4
    },
  }) as const;
