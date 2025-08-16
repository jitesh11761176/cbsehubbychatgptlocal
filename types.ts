
export interface NavItem {
  name: string;
  href: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName?: string;
  role: 'admin' | 'teacher' | 'student';
  photoUrl?: string;
}
