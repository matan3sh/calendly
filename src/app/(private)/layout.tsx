import { NavLink } from '@/components/NavLink'
import { UserButton } from '@clerk/nextjs'
import { CalendarRange } from 'lucide-react'
import { ReactNode } from 'react'

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto">
          <nav className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-8 w-8 text-primary" />
                <span className="text-xl font-semibold">Calendly</span>
              </div>

              <div className="hidden md:flex items-center space-x-6">
                <NavLink href="/events">Events</NavLink>
                <NavLink href="/schedule">Scheduled Events</NavLink>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'h-9 w-9',
                    userButtonTrigger: 'hover:opacity-80 transition-opacity',
                  },
                }}
              />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
