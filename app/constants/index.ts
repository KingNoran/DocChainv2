import { Box, Home, Inbox, Settings, Link, CloudLightning, TablePropertiesIcon } from "lucide-react";

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

export const registrarSidebarLinks = [
  {
    title: "Dashboard",
    url: "/registrar",
    icon: Home,
  },
  {
    title: "Register Student",
    url: "/registrar/create",
    icon: Box,
  },
  {
    title: "View Students",
    url: "/registrar/students",
    icon: TablePropertiesIcon,
  },
  {
    title: "Settings",
    url: "/registrar/settings",
    icon: Settings,
  },
];

export const adminSidebarLinks = [
    {
        icon: Home,
        url: "/admin",
        title: "Dashboard",
    },
    {
        icon: Box,
        url: "/admin/create",
        title: "Create Account",
    },
    {
        icon: Link,
        url: "/admin/chain",
        title: "Push to Chain",
    },
    {
        icon: Inbox,
        url: "/admin/requests",
        title: "See Requests",
    },
    {
        icon: Settings,
        url: "/admin/settings",
        title: "Settings",
    },
];

export const FIELD_NAMES = {
    firstName: "Full Name",
    middleName: "Middle Name (optional)",
    lastName: "Last Name",
    email: "Email",
    role: "Role",
    password: "Password",
    tor: "TOR",
}

export const FIELD_TYPES = {
    firstName: "text",
    middleName: "text",
    lastName: "text",
    email: "email",
    role: "text",
    password: "password",
    tor: "boolean",
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