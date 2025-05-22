import { Box, Home, Inbox, Settings, Link } from "lucide-react";

export const navigationLinks = [
    {
        href: "/my-profile",
        label: "Profile",
    },
    {
        img: "/icons/user.svg",
        selectedImg: "/icons/user-fill.svg",
        href: "/my-profile",
        label: "My Profile",
    }
];

export const adminSidebarLinks = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    }, 
    {
      title: "Create Account",
      url: "/admin/create",
      icon: Box
    },
    {
      title: "Request Validation",
      url: "/admin/transaction",
      icon: Inbox,
    },
    {
      title: "Insert to Chain",
      url: "/admin/chain",
      icon: Link,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ];

export const FIELD_NAMES = {
    firstName: "Full Name",
    middleName: "Middle Name (optional)",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    role: "Role",
    password: "Password",
}

export const FIELD_TYPES = {
    firstName: "text",
    middleName: "text",
    lastName: "text",
    email: "email",
    phone: "text",
    role: "text",
    password: "password",
}

export const sampleStudents = [
    {
        id: 1,
        first_name: "Ken Jervis",
        middle_name: "Guinto",
        last_name: "Reyes",
        course: "BSCS",
        year: 3,
        semester: 2,
        created_at: Date.now(),
        last_activity: Date.now(),
        tor_ready: false
    }
];