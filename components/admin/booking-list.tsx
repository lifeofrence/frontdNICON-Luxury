'use client'

import { useState, useEffect } from 'react'
import { Booking, cancelBooking, getBooking, checkOutBooking } from '@/app/admin/bookings/booking-actions'
import { BookingForm } from './booking-form'
import { BookingDetailsDialog } from './booking-details-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Pencil, LogOut, Loader2, Search, Check, X, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BookingListProps {
    initialBookings: {
        data: Booking[],
        current_page: number,
        last_page: number,
        total: number
    } // Matches Laravel pagination structure usually, but we need to check if 'data' is the wrapper or the array. 
    // The server action returns { data: { ...pagination } }
}

export function BookingList({ initialBookings }: BookingListProps) {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings.data)

    useEffect(() => {
        setBookings(initialBookings.data)
    }, [initialBookings.data])

    // Pagination state can be added here if needed, for now just displaying initial page

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEmailOpen, setIsEmailOpen] = useState(false)
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [emailSubject, setEmailSubject] = useState('')
    const [emailMessage, setEmailMessage] = useState('')
    const [sendingEmail, setSendingEmail] = useState(false)
    const router = useRouter()

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'confirmed': return 'default'
            case 'pending': return 'warning'
            case 'cancelled': return 'destructive'
            default: return 'secondary'
        }
    }

    const handleEmail = (booking: Booking) => {
        setSelectedBooking(booking)
        setEmailSubject(`Regarding your booking NLA${booking.id}`)
        setEmailMessage(`Dear ${booking.guest_name},\n\n`)
        setIsEmailOpen(true)
    }

    const handleSendEmail = async () => {
        if (!selectedBooking || !emailSubject || !emailMessage) {
            alert('Please fill in all email fields')
            return
        }

        setSendingEmail(true)

        const { sendEmailToGuest } = await import('@/app/admin/bookings/booking-actions')
        const result = await sendEmailToGuest(selectedBooking.id, emailSubject, emailMessage)

        setSendingEmail(false)

        if (result.success) {
            alert('Email sent successfully!')
            setIsEmailOpen(false)
            setEmailSubject('')
            setEmailMessage('')
        } else {
            alert(result.message || 'Failed to send email')
        }
    }

    // Need to fix badge variant types 
    const getBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" | null | undefined => {
        switch (status) {
            case 'confirmed': return 'default'
            case 'cancelled': return 'destructive'
            case 'pending': return 'secondary' // warning often maps to secondary or needs custom class
            default: return 'outline'
        }
    }


    const handleEdit = (booking: Booking) => {
        setSelectedBooking(booking)
        setIsEditOpen(true)
    }

    const handleView = async (booking: Booking) => {
        setLoadingId(booking.id)
        const { data } = await getBooking(booking.id)
        setLoadingId(null)

        if (data) {
            setSelectedBooking(data)
            setIsViewOpen(true)
        }
    }

    async function handleCancel(id: number) {
        if (!confirm('Are you sure you want to cancel this booking?')) return
        setLoadingId(id)
        const result = await cancelBooking(id)
        setLoadingId(null)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    async function handleCheckOut(id: number) {
        if (!confirm('Check out this guest? This will mark the booking as checked-out and make the room available.')) return
        setLoadingId(id)
        const result = await checkOutBooking(id)
        setLoadingId(null)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    const refreshList = () => {
        router.refresh()
    }

    return (
        <>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Guest</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Check-in / Out</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">NLA{booking.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{booking.guest_name}</span>
                                            <span className="text-xs text-muted-foreground">{booking.guest_email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {booking.room?.room_number ? (
                                            <Badge variant="outline">Room {booking.room.room_number}</Badge>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Unassigned</span>
                                        )}
                                        <div className="text-xs text-muted-foreground mt-1">{booking.room_type?.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>In: {formatDate(booking.check_in_date)}</div>
                                            <div>Out: {formatDate(booking.check_out_date)}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getBadgeVariant(booking.status)}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleView(booking)}>
                                                    <Search className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => handleEmail(booking)}>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Email
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => handleEdit(booking)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Details
                                                </DropdownMenuItem>

                                                {booking.status === 'confirmed' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            onClick={() => handleCheckOut(booking.id)}
                                                            className="text-blue-600"
                                                        >
                                                            <Check className="mr-2 h-4 w-4" />
                                                            Check Out
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}

                                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="text-red-600"
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Cancel Booking
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedBooking && (
                <BookingForm
                    open={isEditOpen}
                    setOpen={setIsEditOpen}
                    booking={selectedBooking}
                    onUpdate={refreshList}
                />
            )}

            {selectedBooking && (
                <BookingDetailsDialog
                    open={isViewOpen}
                    setOpen={setIsViewOpen}
                    booking={selectedBooking}
                />
            )}

            {/* Email Dialog */}
            <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Send Email to Guest</DialogTitle>
                        <DialogDescription>
                            Send an email to {selectedBooking?.guest_name} ({selectedBooking?.guest_email})
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="Email subject"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                                placeholder="Email message..."
                                rows={10}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEmailOpen(false)} disabled={sendingEmail}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendEmail} disabled={sendingEmail || !emailSubject || !emailMessage}>
                            {sendingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
