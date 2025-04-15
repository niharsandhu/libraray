"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface MainNavProps {
  isAdmin?: boolean
}

export function MainNav({ isAdmin = false }: MainNavProps) {
  const pathname = usePathname()

  const routes = isAdmin
    ? [
        { href: "/admin-dashboard", label: "Dashboard" },
        { href: "/admin-dashboard/books", label: "Books" },
        { href: "/admin-dashboard/users", label: "Users" },
        { href: "/admin-dashboard/returns", label: "Returns" },
      ]
    : [
        { href: "/user-dashboard", label: "Dashboard" },
        { href: "/user-dashboard/browse", label: "Browse Books" },
        { href: "/user-dashboard/borrowed", label: "My Books" },
        { href: "/user-dashboard/reservations", label: "Reservations" },
      ]

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href={isAdmin ? "/admin-dashboard" : "/user-dashboard"} className="flex items-center gap-2 mr-6">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold hidden md:inline-flex">LibraryHub</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === route.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 rounded-full">
                <span className="sr-only">Open user menu</span>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted h-8 w-8 flex items-center justify-center">
                    <span className="text-xs font-medium">JD</span>
                  </div>
                  <span className="hidden md:inline-flex">John Doe</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
