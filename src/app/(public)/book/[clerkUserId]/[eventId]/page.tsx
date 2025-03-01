import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/drizzle/db'
import { clerkClient } from '@clerk/nextjs/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 0

interface BookEventPageProps {
  params: Promise<{ clerkUserId: string; eventId: string }>
}

export default async function BookEventPage(props: BookEventPageProps) {
  const { clerkUserId, eventId } = await props.params

  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
      and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
  })

  if (event == null) return notFound()

  const calendarUser = await (await clerkClient()).users.getUser(clerkUserId)

  const validTimes = []

  if (validTimes.length === 0) {
    return <NoTimeSlots event={event} calendarUser={calendarUser} />
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          Book {event.name} with {calendarUser.fullName}
        </CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>Meeting Form</CardContent>
    </Card>
  )
}

function NoTimeSlots({
  event,
  calendarUser,
}: {
  event: { name: string; description: string | null }
  calendarUser: { id: string; fullName: string | null }
}) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          Book {event.name} with {calendarUser.fullName}
        </CardTitle>
        {event.description && (
          <CardDescription>{event.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {calendarUser.fullName} is currently booked up. Please check back later
        or choose a shorter event.
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/book/${calendarUser.id}`}>Choose Another Event</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
