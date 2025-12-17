'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Booking, updateBooking } from '@/app/admin/bookings/booking-actions'
import { Loader2 } from 'lucide-react'

interface BookingFormProps {
    open: boolean
    setOpen: (open: boolean) => void
    booking: Booking
    onUpdate: () => void
}

const STATUSES = ['pending', 'confirmed', 'cancelled']

export function BookingForm({ open, setOpen, booking, onUpdate }: BookingFormProps) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<any>({})

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setErrors({})

        const formData = new FormData(event.currentTarget)

        // Server action
        const result = await updateBooking(booking.id, null, formData)

        setLoading(false)

        if (result.success) {
            setOpen(false)
            onUpdate()
        } else {
            if (result.errors) {
                setErrors(result.errors)
            } else {
                setErrors({ form: result.message })
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Booking NLA{booking.id}</DialogTitle>
                    <DialogDescription>
                        Update booking details/status.
                    </DialogDescription>
                </DialogHeader>

                {errors.form && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="guest_name">Guest Name</Label>
                        <Input
                            id="guest_name"
                            name="guest_name"
                            defaultValue={booking.guest_name}
                            required
                        />
                        {errors.guest_name && <p className="text-red-500 text-sm">{errors.guest_name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="guest_email">Email</Label>
                            <Input
                                id="guest_email"
                                name="guest_email"
                                type="email"
                                defaultValue={booking.guest_email}
                                required
                            />
                            {errors.guest_email && <p className="text-red-500 text-sm">{errors.guest_email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="guest_phone">Phone</Label>
                            <Input
                                id="guest_phone"
                                name="guest_phone"
                                defaultValue={booking.guest_phone}
                                required
                            />
                            {errors.guest_phone && <p className="text-red-500 text-sm">{errors.guest_phone}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={booking.status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Note: Cancelling a booking will automatically free up the assigned room.
                        </p>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold block">Room Type</span>
                            {booking.room_type?.name || 'N/A'}
                        </div>
                        <div>
                            <span className="font-semibold block">Assigned Room</span>
                            {booking.room?.room_number || 'Not Assigned'}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
