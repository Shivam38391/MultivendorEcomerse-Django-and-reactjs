import { Bell, BellDotIcon, CircleUser, CircleUserIcon, icons, LayoutDashboard, ListCheckIcon, ListOrdered, ListOrderedIcon, Menu, Package2, Search, Settings2, SettingsIcon, ShoppingCart } from "lucide-react";

// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { CartContext } from "../plugin/Context";
import { Badge } from "@/components/ui/badge";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { FaProductHunt } from "react-icons/fa";

export const description =
    "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.";
export function Header() {

    const cartCount = useContext(CartContext)
    const [search, setSearch] = useState("")

    const [isLoggedIn, user] = useAuthStore((state) => [
        state.isLoggedIn,
        state.user,
    ]);

    console.log("user().vendor_id", user().vendor_id);

    const navigate = useNavigate()

    const handleSearchChange = (event: any) => {
        setSearch(event.target.value);
        console.log(search);
        // navigate(`/search?query=${search}`)

    }


    const handleKeyDown = (event: any) => {

        if (event.key === 'Enter') {
            console.log("search", search)
            navigate(`/search?query=${search}`)

        }
    };


    const AccountLinks = [
        {
            label: "Account",
            path: "/customer/account/",
            icons: <CircleUserIcon/>
        },
        {
            label: "Order",
            path: "/customer/orders/",
            icons: <ListOrderedIcon/>

        },
        {
            label: "Wishlist",
            path: "/customer/wishlist/",
            icons: <ListCheckIcon/>

        },
        {
            label: "Notifications",
            path: "/customer/notifications/",
            icons: <BellDotIcon/>

        },
        {
            label: "Settings",
            path: "/customer/settings/",
            icons: <SettingsIcon/>

        },
    ]


    const VendorLinks = [
        {
            label: "Dashboard",
            path: "/vendor/dashboard",
            icons: <LayoutDashboard/>
        },
        {
            label: "Order",
            path: "/vendor/orders/",
            icons: <ListOrdered/>

        },
        {
            label: "Add Products",
            path: "/vendor/product/new/",
            icons: <FaProductHunt/>

        },
        {
            label: "Notifications",
            path: "/vendor/notifications/",
            icons: <Bell/>

        },
        {
            label: "Settings",
            path: "/vendor/settings/",
            icons: <Settings2/>

        },
    ]


    return (
        <div className="flex w-full flex-col  bg-pink-300">
            <header className="sticky bg-black text-white top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">









                    <Link
                        to={"/"}
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className=" text-black" >Accounts</NavigationMenuTrigger>
                                <NavigationMenuContent>

                                    <ul className="grid w-[100px] gap-3 p-4 md:w-[200px]  lg:w-[300px]">


                                        {

                                            AccountLinks.map((i, j) => (
                                                <NavigationMenuLink>

                                                    <NavLink key={j}
                                                        className={({ isActive }) => {
                                                            return `flex items-center gap-3   transition-all   ${isActive && "bg-slate-700 text-white"}`;
                                                        }}
                                                        to={i.path}>

                                                            {i.icons}
                                                        {i.label}

                                                    </NavLink>
                                                </NavigationMenuLink>


                                            ))
                                        }

                                    </ul>


                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
 


                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className=" text-black" >Vendor</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[100px] gap-3 p-4 md:w-[200px]  lg:w-[300px]">
                                        {
                                            VendorLinks.map((i, j) => (
                                                <NavigationMenuLink>
                                                    <NavLink key={j}
                                                        className={({ isActive }) => {
                                                            return `flex items-center gap-3   transition-all   ${isActive && "bg-slate-700 text-white"}`;
                                                        }}
                                                        to={i.path}>
                                                            {i.icons}
    
                                                        {i.label}
                                                    </NavLink>
                                                </NavigationMenuLink>
                                            ))
                                        }
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
 



                    {isLoggedIn()
                        ?
                        <>
                            <NavLink

                                className={({ isActive }) => {
                                    return `flex items-center gap-3 rounded-lg px-3 py-2  transition-all   ${isActive && "bg-slate-700 text-white"}`;
                                }}

                                to={'/customer/account/'}>Account

                            </NavLink>
                            <NavLink

                                className={({ isActive }) => {
                                    return `flex items-center gap-3 rounded-lg px-3 py-2  transition-all   ${isActive && "bg-slate-700 text-white"}`;
                                }}

                                to="/logout">
                                Logout
                            </NavLink>
                        </>
                        :
                        <>
                            <NavLink

                                className={({ isActive }) => {
                                    return `flex items-center gap-3 rounded-lg px-3 py-2  transition-all   ${isActive && "bg-slate-700 text-white"}`;
                                }}


                                to="/login">
                                Login
                            </NavLink>


                            <NavLink

                                className={({ isActive }) => {
                                    return `flex items-center gap-3 rounded-lg px-3 py-2  transition-all   ${isActive && "bg-slate-700 text-white"}`;
                                }}

                                to="/register">
                                Register

                            </NavLink>

                        </>
                    }
                    <Link className=" flex    items-center   text-[16px]  gap-2" to="/cart/">

                        <div className=" relative">
                            <ShoppingCart size={28} />
                            <Badge className=" size-4 absolute top-0 right-0 ">
                                {cartCount || 0}
                            </Badge>
                        </div>

                        Cart

                    </Link>





                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                to={"/"}
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link to={"/"} className="hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link
                                to={"/"}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Orders
                            </Link>
                            <Link
                                to={"/"}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Products
                            </Link>
                            <Link
                                to={"/"}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Customers
                            </Link>
                            <Link
                                to={"/"}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Analytics
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                onKeyDown={handleKeyDown}
                                onChange={handleSearchChange}
                                type="search"
                                placeholder="Search products..."
                                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"></main>
        </div>
    );
}
