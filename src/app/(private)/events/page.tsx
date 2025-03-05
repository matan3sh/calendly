import { CopyEventButton } from '@/components/CopyEventButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { db } from '@/drizzle/db'
import { formatEventDescription } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { CalendarPlus, CalendarRange, Clock } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function EventsPage() {
  const { userId, redirectToSignIn } = await auth()
  if (userId == null) return redirectToSignIn()

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold">My Event Types</h1>
        <Button asChild size="lg">
          <Link href="/events/new">
            <CalendarPlus className="mr-2 h-5 w-5" />
            New Event Type
          </Link>
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <CalendarRange className="h-12 w-12 text-primary" />
            <h3 className="text-lg font-medium">No event types yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first event type to start accepting bookings
            </p>
            <Button size="lg" asChild>
              <Link href="/events/new">
                <CalendarPlus className="mr-2 h-5 w-5" />
                New Event Type
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

type EventCardProps = {
  id: string
  isActive: boolean
  name: string
  description: string | null
  durationInMinutes: number
  clerkUserId: string
}

function EventCard({
  id,
  isActive,
  name,
  description,
  durationInMinutes,
  clerkUserId,
}: EventCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-200',
        !isActive && 'opacity-60'
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium mb-1">{name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {formatEventDescription(durationInMinutes)}
            </div>
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          {isActive && (
            <CopyEventButton
              variant="ghost"
              size="sm"
              eventId={id}
              clerkUserId={clerkUserId}
              className="text-primary hover:text-primary/80"
            />
          )}
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link href={`/events/${id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform" />
    </Card>
  )
}
