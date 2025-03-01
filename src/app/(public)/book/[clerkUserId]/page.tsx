import { db } from '@/drizzle/db'
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

  return <div className="max-w-5xl mx-auto">Booking Page</div>
}
