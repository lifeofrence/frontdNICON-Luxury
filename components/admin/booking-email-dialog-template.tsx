
// Email Dialog Component (add near the bottom before closing tag)
{/* Email Dialog */ }
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
            <Button onClick={handleSendEmail} disabled={sendingEmail}>
                {sendingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Email
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
