export enum EEmployeeRole {
  'manage' = 'manage',
  'security' = 'security',
  'serve' = 'serve',
  'chef' = 'chef',
}

export type TEmployeeSelection = {
  roleName: string;
  icon: string;
  role: EEmployeeRole;
};
