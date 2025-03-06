import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { db } from '@/drizzle/db'
import { formatEventDescription } from '@/lib/formatters'
import { clerkClient } from '@clerk/nextjs/server'
import { Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 0

interface BookingPageProps {
  params: Promise<{ clerkUserId: string }>
}

export default async function BookingPage(props: BookingPageProps) {
  const { clerkUserId } = await props.params

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  })

  if (events.length === 0) return notFound()

  const { fullName } = await clerkClient().users.getUser(clerkUserId)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold mb-4">{fullName}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Welcome to my scheduling page. Please select an event to proceed with
          booking.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  )
}

type EventCardProps = {
  id: string
  name: string
  clerkUserId: string
  description: string | null
  durationInMinutes: number
}

function EventCard({
  id,
  name,
  description,
  clerkUserId,
  durationInMinutes,
}: EventCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-2">{name}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="mr-2 h-4 w-4" />
          {formatEventDescription(durationInMinutes)}
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
            {description}
          </p>
        )}

        <Button asChild className="w-full group-hover:bg-primary/90">
          <Link href={`/book/${clerkUserId}/${id}`}>Select</Link>
        </Button>
      </div>
    </Card>
  )
}
