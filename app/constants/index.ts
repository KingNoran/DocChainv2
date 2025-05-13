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

export const adminSideBarLinks = [
    {
        img: "/icons/admin/home.svg",
        route: "/admin",
        text: "Home",
    },
    {
        img: "icons/admin/students.svg",
        route: "/admin/students",
        text: "All Students",
    },
    {
        img: "/icons/admin/tor.svg",
        route: "/admin/tors",
        text: "All TORs",
    },
    {
        img: "/icons/admin/bookmark.svg",
        route: "/admin/book-requests",
        text: "Borrow Requests",
    },
    {
        img: "/icons/admin/user.svg",
        route: "/admin/account-requests",
        text: "Account Requests",
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