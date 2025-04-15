"use client"

import type React from "react"

import { useState } from "react"
import { BookOpen, CheckCircle, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainNav } from "@/components/main-nav"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for books
const books = [
  {
    id: "B001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrower: "John Doe",
    borrowDate: "2024-04-01",
    returnDate: "2024-04-15",
    status: "borrowed",
  },
  {
    id: "B002",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    borrower: "Jane Smith",
    borrowDate: "2024-03-20",
    returnDate: "2024-04-03",
    status: "overdue",
  },
  {
    id: "B003",
    title: "1984",
    author: "George Orwell",
    borrower: "Mike Johnson",
    borrowDate: "2024-03-25",
    returnDate: "2024-04-08",
    status: "borrowed",
  },
  {
    id: "B004",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    borrower: "Sarah Williams",
    borrowDate: "2024-03-28",
    returnDate: "2024-04-11",
    status: "borrowed",
  },
  {
    id: "B005",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    borrower: "Robert Brown",
    borrowDate: "2024-03-15",
    returnDate: "2024-03-29",
    status: "overdue",
  },
]

export default function AdminDashboard() {
  const [searchId, setSearchId] = useState("")
  const [searchResult, setSearchResult] = useState<(typeof books)[0] | null>(null)
  const [returnStatus, setReturnStatus] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const book = books.find((book) => book.id === searchId)
    setSearchResult(book || null)
    if (!book) {
      setReturnStatus("Book not found. Please check the ID and try again.")
      setTimeout(() => setReturnStatus(null), 3000)
    } else {
      setReturnStatus(null)
    }
  }

  const handleConfirmReturn = () => {
    if (searchResult) {
      setReturnStatus(`Book "${searchResult.title}" has been marked as returned.`)
      setSearchResult(null)
      setSearchId("")
      setTimeout(() => setReturnStatus(null), 3000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col ">
      <MainNav isAdmin={true} />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Books</CardTitle>
              <CardDescription>Books in the library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">125</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Borrows</CardTitle>
              <CardDescription>Currently borrowed books</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Registered Users</CardTitle>
              <CardDescription>Total user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">78</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Borrowed Books</CardTitle>
                <CardDescription>Currently checked out books</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">5 books</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.id}</TableCell>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.borrower}</TableCell>
                      <TableCell>{book.returnDate}</TableCell>
                      <TableCell>
                        {book.status === "borrowed" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Overdue
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Book Return</CardTitle>
              <CardDescription>Search book by ID to confirm return</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search-id">Book ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search-id"
                      placeholder="Enter book ID"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                    />
                    <Button type="submit" size="icon" variant="outline">
                      <Search className="h-4 w-4" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </div>
                </div>

                {searchResult && (
                  <div className="border rounded-md p-4 space-y-4">
                    <div>
                      <h3 className="font-medium">{searchResult.title}</h3>
                      <p className="text-sm text-muted-foreground">{searchResult.author}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Borrower:</p>
                        <p>{searchResult.borrower}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Return Date:</p>
                        <p>{searchResult.returnDate}</p>
                      </div>
                    </div>
                    <Button onClick={handleConfirmReturn} className="w-full">
                      Confirm Return
                    </Button>
                  </div>
                )}

                {returnStatus && (
                  <p className={`text-sm ${searchResult ? "text-green-600" : "text-red-600"}`}>{returnStatus}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest library transactions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">User activity</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Book Returned</h3>
                    <p className="text-sm text-muted-foreground">
                      "Harry Potter and the Philosopher's Stone" returned by Emma Wilson
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">Today, 10:30 AM</div>
                </div>
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">New Book Borrowed</h3>
                    <p className="text-sm text-muted-foreground">"The Lord of the Rings" borrowed by James Thompson</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Today, 9:15 AM</div>
                </div>
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">New User Registration</h3>
                    <p className="text-sm text-muted-foreground">Lisa Johnson created a new account</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Yesterday, 4:45 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
