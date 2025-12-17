'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export async function getAnalytics() {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        const res = await fetch(`${API_URL}/api/admin/analytics`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch analytics: ${res.statusText}`)
        }

        const data = await res.json()
        return { data }
    } catch (error) {
        console.error('getAnalytics error:', error)
        return { error: 'Failed to fetch analytics' }
    }
}
