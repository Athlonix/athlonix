import { z } from '@hono/zod-openapi';

export const RoleEnum = z.enum([
  'PRESIDENT',
  'VICE_PRESIDENT',
  'SECRETARY',
  'TREASURER',
  'REDACTOR',
  'PROJECT_MANAGER',
  'COMMUNICATION_OFFICER',
]);

export type Role_name = z.infer<typeof RoleEnum>;

const baseSchema = z.object({
  role: RoleEnum,
  name: z.string(),
});

export const hierarchySchema: z.ZodType<TreeNode> = baseSchema.extend({
  children: z.lazy(() => hierarchySchema.array()).optional(),
});

export interface TreeNode {
  role: Role_name;
  name: string;
  children?: TreeNode[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  roles: { id: number; name: string }[];
}

export function buildHierarchy(users: User[]): TreeNode {
  const userMap = new Map<string, User>();
  for (const user of users) {
    if (!user.roles) {
      continue;
    }
    userMap.set(String(user.id), user);
  }

  const treeData: TreeNode = {
    role: 'PRESIDENT',
    name: '',
    children: [
      {
        role: 'SECRETARY',
        name: '',
        children: [
          { role: 'REDACTOR', name: '' },
          { role: 'PROJECT_MANAGER', name: '' },
          { role: 'COMMUNICATION_OFFICER', name: '' },
        ],
      },
      {
        role: 'VICE_PRESIDENT',
        name: '',
      },
      {
        role: 'TREASURER',
        name: '',
      },
    ],
  };

  const findAndSetUser = (node: TreeNode | undefined, roleName: Role_name): void => {
    if (!node) {
      return;
    }
    const user = users.find((u) => u.roles.some((role) => role.name === roleName));
    node.name = user ? `${user.first_name} ${user.last_name}` : 'N/A';
  };

  findAndSetUser(treeData, 'PRESIDENT');
  if (treeData.children) {
    findAndSetUser(treeData.children[0], 'SECRETARY');
    findAndSetUser(treeData.children[1], 'VICE_PRESIDENT');
    findAndSetUser(treeData.children[2], 'TREASURER');

    const secretaryChildren = treeData.children[0] ? treeData.children[0].children : undefined;
    if (secretaryChildren) {
      findAndSetUser(secretaryChildren[0], 'REDACTOR');
      findAndSetUser(secretaryChildren[1], 'PROJECT_MANAGER');
      findAndSetUser(secretaryChildren[2], 'COMMUNICATION_OFFICER');
    }
  }

  return treeData;
}
