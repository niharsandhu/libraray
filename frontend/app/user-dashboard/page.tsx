"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { CalendarIcon, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MainNav } from "@/components/main-nav"
import { cn } from "@/lib/utils"

type Book = {
  id: string
  title: string
  author: string
  borrowDate: string
  returnDate: string
  bookTitle: string
  status: "active" | "overdue"
}

const returnDates = [
  new Date(2024, 3, 3),
  new Date(2024, 3, 8),
  new Date(2024, 3, 15),
]

export default function UserDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [bookId, setBookId] = useState("")
  const [reservationStatus, setReservationStatus] = useState<string | null>(null)
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const handleReserveBook = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!bookId.trim()) return

    try {
      const userId = "user123" // Replace this with actual logged-in user ID, e.g., from context or localStorage

      const res = await fetch("https://libraray-oomo.onrender.com/api/reservations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          bookId: bookId.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Reservation failed")
      }

      setReservationStatus(`✅ ${data.message}`)
      setBookId("")
    } catch (error: any) {
      setReservationStatus(`❌ ${error.message}`)
    } finally {
      setTimeout(() => setReservationStatus(null), 3000)
    }
  }

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/borrowed-books/books")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setBorrowedBooks(data)
      } catch (error) {
        console.error("Error fetching borrowed books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBorrowedBooks()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  modifiers={{
                    highlighted: returnDates,
                  }}
                  modifiersStyles={{
                    highlighted: { backgroundColor: "#f0f9ff", color: "#0369a1", fontWeight: "bold" },
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Books</CardTitle>
                  <CardDescription>Books in your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{borrowedBooks.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Borrows</CardTitle>
                  <CardDescription>Currently borrowed books</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {borrowedBooks.filter((book) => book.status === "active").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Overdue</CardTitle>
                  <CardDescription>Books past return date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">
                    {borrowedBooks.filter((book) => book.status === "overdue").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Borrowed Books</CardTitle>
                  <CardDescription>Books you currently have checked out</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {borrowedBooks.map((book) => (
                      <div key={book.id} className="flex items-start justify-between border-b pb-4">
                        <div>
                          <h3 className="font-medium">{book.bookTitle}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Return by {book.returnDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {book.status === "active" ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              <Clock className="mr-1 h-3 w-3" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reserve a Book</CardTitle>
                    <CardDescription>Enter book ID to reserve</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReserveBook} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="book-id">Book ID</Label>
                        <Input
                          id="book-id"
                          placeholder="Enter book ID"
                          value={bookId}
                          onChange={(e) => setBookId(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Reserve Book
                      </Button>
                      {reservationStatus && <p className="text-sm text-green-600">{reservationStatus}</p>}
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
