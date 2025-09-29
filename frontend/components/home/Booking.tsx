"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { useUserContext } from "@/context/userContext"
import toast from "react-hot-toast";

type EventType =
  | "Wedding"
  | "Birthday Party"
  | "Engagement"
  | "Cocktail Party"
  | "Corporate Event"
  | "Get Together"
  | "Other"

type TimeSelection = {
  hour: number // 1-12
  minute: number // 0,15,30,45
  period: "AM" | "PM"
}

type BudgetTier = "₹700-₹1000" | "₹1000-₹1250" | "₹2000+"

type BookingState = {
  eventType?: EventType
  otherEventText?: string
  date?: Date | null
  time?: TimeSelection | null
  budget?: BudgetTier
  guests?: number
  contact?: {
    name: string
    phone: string
    email: string
  }
}

const STORAGE_KEY = "booking-modal-state-v1"

const totalSteps = 7
const stepKeys = [
  "Event Selection",
  "Date Picker",
  "Time Picker",
  "Per Person Budget",
  "Guest Count",
  "Contact Info",
  "Review & Confirm",
] as const

function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return initial
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])

  return [value, setValue] as const
}

function SuccessConfetti() {
  // Lightweight confetti: 24 bars falling with staggered animations
  const pieces = Array.from({ length: 24 })
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const delay = i * 0.05
        const xStart = (i % 12) * (100 / 12)
        return (
          <motion.div
            key={i}
            initial={{ y: -40, x: `${xStart}%`, rotate: 0, opacity: 0 }}
            animate={{
              y: ["-10%", "110%"],
              rotate: [0, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 1.8, delay, ease: "easeOut" }}
            className="absolute top-0 h-3 w-1.5 rounded-sm"
            style={{
              background:
                i % 2 === 0
                  ? "linear-gradient(180deg, var(--color-chart-1), var(--color-chart-2))"
                  : "linear-gradient(180deg, var(--color-chart-4), var(--color-chart-5))",
            }}
          />
        )
      })}
    </div>
  )
}

function SuccessCheckmark() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="Success" className="mx-auto">
      <motion.circle
        cx="48"
        cy="48"
        r="44"
        fill="none"
        stroke="currentColor"
        className="text-primary/30"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <motion.path
        d="M26 50 L42 64 L70 34"
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      />
    </svg>
  )
}

function TopProgress({ step }: { step: number }) {
  const pct = ((step + 1) / totalSteps) * 100
  return (
    <div className="space-y-3">
      <div className="h-2 w-full rounded-full bg-muted">
        <motion.div
          className="h-2 rounded-full bg-primary"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={cn("h-2 w-2 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
    </div>
  )
}

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

const events = [
  { label: "Conference", imgAlt: "birthday-party.png", imgQuery: "conference" },
  { label: "Workshop",   imgAlt: "birthday-party.png", imgQuery: "workshop" },
  { label: "Meetup",     imgAlt: "birthday-party.png", imgQuery: "meetup" },
  { label: "Festival",   imgAlt: "birthday-party.png", imgQuery: "festival" },
  { label: "Expo",       imgAlt: "birthday-party.png", imgQuery: "expo" },
  { label: "Hackathon",  imgAlt: "birthday-party.png", imgQuery: "hackathon" },
];

function EventCard({
  label,
  selected,
  onSelect,
  imgAlt,
  imgQuery,
}: {
  label: EventType
  selected: boolean
  onSelect: () => void
  imgAlt: string
  imgQuery: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative overflow-hidden rounded-xl border",
        "bg-card hover:bg-accent transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary" : "border-border",
      )}
      aria-pressed={selected}
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={`/events/${label.toLowerCase().replace(/\s+/g, "-")}.png`}
          alt={imgAlt}
          className="h-full w-full object-cover"
        />
      </div>
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition",
          selected ? "ring-2 ring-primary/70" : "ring-0",
        )}
      />
      <div className="p-3">
        <div className={cn("text-sm font-medium transition-transform", "group-hover:translate-y-[-1px]")}>{label}</div>
      </div>
      <motion.div
        aria-hidden
        initial={false}
        animate={{
          boxShadow: selected ? "0 0 24px 2px var(--color-primary)" : "0 0 0 0 transparent",
          scale: selected ? 1.01 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute inset-0 rounded-xl"
        style={{ pointerEvents: "none" }}
      />
    </button>
  )
}

function Wheel({
  values,
  selected,
  onSelect,
  ariaLabel,
}: {
  values: (string | number)[]
  selected: string | number
  onSelect: (v: string | number) => void
  ariaLabel: string
}) {
  return (
    <div className="relative h-56 w-24 overflow-y-auto scroll-smooth snap-y snap-mandatory rounded-lg border bg-card">
      {/* Removed blur strip causing middle blur artifact */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-10 pointer-events-none border-y border-border bg-transparent" />
      <ul className="p-2 space-y-1" role="listbox" aria-label={ariaLabel}>
        {values.map((v) => {
          const isSel = v === selected
          return (
            <li key={String(v)} className="snap-center">
              <button
                type="button"
                role="option"
                aria-selected={isSel}
                onClick={() => onSelect(v)}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-center",
                  isSel ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                )}
              >
                {v}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


export default function BookingModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = usePersistentState<number>("booking-step-v1", 0)
  const [state, setState] = usePersistentState<BookingState>(STORAGE_KEY, {
    contact: { name: "", phone: "", email: "" },
  })

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const touchStartX = React.useRef<number | null>(null)

  const close = React.useCallback(() => {
    setOpen(false)
  }, [])

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === "Escape") {
        e.preventDefault()
        close()
      } else if (e.key === "Enter") {
        // Enter = Next
        e.preventDefault()
        handleNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, step, state])

  React.useEffect(() => {
    if (step === 1 && state.date) {
      const tomorrowClamp = new Date()
      tomorrowClamp.setHours(0, 0, 0, 0)
      tomorrowClamp.setDate(tomorrowClamp.getDate() + 1)

      const selected = new Date(state.date)
      selected.setHours(0, 0, 0, 0)

      if (selected < tomorrowClamp) {
        setState((s) => ({ ...s, date: null }))
      }
    }
  }, [step, state.date, setState])

  function canProceed(currentStep = step) {
    switch (currentStep) {
      case 0: {
        if (!state.eventType) return false
        if (state.eventType === "Other") {
          return Boolean(state.otherEventText && state.otherEventText.trim().length > 0)
        }
        return true
      }
      case 1: {
        return Boolean(state.date && state.date instanceof Date)
      }
      case 2: {
        return Boolean(state.time && state.time.hour && state.time.period)
      }
      case 3: {
        return Boolean(state.budget)
      }
      case 4: {
        return typeof state.guests === "number" && state.guests >= 20
      }
      case 5: {
        const c = state.contact
        if (!c) return false
        const phoneValid = /^[0-9]+$/.test(c.phone) && c.phone.length >= 7
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)
        const nameValid = c.name.trim().length > 1
        return phoneValid && emailValid && nameValid
      }
      case 6: {
        return true
      }
      default:
        return false
    }
  }

  function handleNext() {
    if (!canProceed()) return
    if (step < totalSteps - 1) {
      setStep(step + 1)
    }
  }
  function handleBack() {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartX.current
    if (start == null) return
    const endX = e.changedTouches[0].clientX
    const delta = endX - start
    const threshold = 60
    if (delta < -threshold && canProceed()) {
      handleNext()
    } else if (delta > threshold) {
      handleBack()
    }
    touchStartX.current = null
  }

  const [submitted, setSubmitted] = React.useState(false)

  // function confirmBooking() {
  //   // Simulate submission then show success
  //   setSubmitted(true)
  //   console.log("Booking confirmed", state)
  //   // Optionally: clear progress but keep contact for convenience
  //   // setState({ contact: state.contact })
  //   // setStep(0); 
  // }

  // Derived values/helpers
 
  async function confirmBooking() {
     if (submitted) return; // Already confirm
  try {
    // Optionally: transform your state into API payload
    const bookingData = {
      eventType: state.eventType,
      otherEventText: state.otherEventText,
      date: state.date,
      time: state.time,
      budget: state.budget,
      guests: state.guests,
      contact: state.contact,
    };

    // Call Context API function
    const response = await createBooking(bookingData); // Axios call happens inside Context
    setSubmitted(true);

    console.log("Booking confirmed:", response);

    // Show success animation

    // Optionally reset progress but keep contact info
    // setState({ contact: state.contact });
    // setStep(0);
  } catch (error: any) {
    console.error("Booking failed:", error.response?.data || error.message);
    setSubmitted(false);
    // Optionally show toast or error message to user
  }
}

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = [0, 15, 30, 45]
  const periods: Array<"AM" | "PM"> = ["AM", "PM"]

  const quickSlots: Array<{ label: string; time: TimeSelection }> = [
    { label: "Morning", time: { hour: 10, minute: 0, period: "AM" } },
    { label: "Afternoon", time: { hour: 2, minute: 0, period: "PM" } },
    { label: "Evening", time: { hour: 7, minute: 0, period: "PM" } },
  ]

  function budgetLabel(b: BudgetTier) {
    if (b === "₹700-₹1000") return "₹700–₹1000"
    if (b === "₹1000-₹1250") return "₹1000–₹1250"
    return "₹2000+"
  }

  function guestEmoji(count: number | undefined) {
    if (!count || count < 50) return "🎂"
    if (count < 150) return "🍰"
    if (count < 300) return "🎊"
    if (count < 500) return "🎉"
    if (count < 800) return "🏟️"
    return "🏰"
  }

  const today = new Date()
  const tomorrowDate = new Date(today)
  tomorrowDate.setDate(today.getDate() + 1);

  const { createBooking, getBookings, loading } = useUserContext();


  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <AnimatePresence>
        {open && (
          <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden={!open}
            >
            {/* Overlay */}
            {/* <div  className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={close} /> */}
            {/* Modal */}
            <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Booking form"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          "relative w-[92vw] max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl",
          "bg-background/95 border"
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
              <Card className="relative overflow-hidden border-0 bg-transparent shadow-none">
                <div className="p-6 md:p-8">
                  <TopProgress step={step} />

                  <div className="mt-6">
                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="relative"
                        >
                          <SuccessConfetti />
                          <div className="text-center space-y-4 py-6">
                            <SuccessCheckmark />
                            <h3 className="text-2xl font-semibold">
                              {"🎉 Booking Confirmed! We’ll contact you soon 🚀"}
                            </h3>
                            <div className="flex items-center justify-center gap-3">
                              <Button variant="secondary" onClick={close}>
                                Back to Home
                              </Button>
                              {/* <Button
                                onClick={() => {
                                  // Navigate to bookings if route exists
                                  // For now, just close
                                  // onClick={handleBack} 
                                  close()
                                }}
                              >
                                View My Bookings
                              </Button> */}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                        >
                          {step === 0 && (
                            <div className="space-y-4">
                              <SectionTitle
                                title="What are you celebrating?"
                                hint="Choose an event type. Cards glow when selected."
                              />
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                {(
                                  [
                                    "Wedding",
                                    "Birthday Party",
                                    "Engagement",
                                    "Cocktail Party",
                                    "Corporate Event",
                                    "Get Together",
                                  ] as EventType[]
                                ).map((e) => (
                                  <EventCard
                                    key={e}
                                    label={e}
                                    selected={state.eventType === e}
                                    onSelect={() =>
                                      setState((s) => ({
                                        ...s,
                                        eventType: e,
                                        otherEventText: s.eventType === "Other" ? s.otherEventText : "",
                                      }))
                                    }
                                    imgAlt={`${e} illustrative image`}
                                    imgQuery={`${e} event premium photography`}
                                  />
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setState((s) => ({ ...s, eventType: "Other" }))}
                                  aria-pressed={state.eventType === "Other"}
                                  className={cn(
                                    "rounded-xl border p-4 text-left hover:bg-accent transition-colors",
                                    state.eventType === "Other" ? "border-primary" : "border-border",
                                  )}
                                >
                                  <div className="font-medium mb-2">Other</div>
                                  <Input
                                    placeholder="Describe your event"
                                    value={state.otherEventText ?? ""}
                                    onChange={(e) =>
                                      setState((s) => ({
                                        ...s,
                                        eventType: "Other",
                                        otherEventText: e.target.value,
                                      }))
                                    }
                                  />
                                </button>
                              </div>
                            </div>
                          )}

                          {step === 1 && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <SectionTitle title="Pick a date" hint="Popular dates fill fast 🚀" />
                              </div>
                              {/* Updated code */}
                              <div
                                className="rounded-xl border bg-muted/30 p-3 md:p-4"
                                style={{ backgroundColor: "#f0f0f0" }}
                              >
                                <Calendar
                                  mode="single"
                                  selected={state.date ?? undefined}
                                  onSelect={(d: any) => setState((s) => ({ ...s, date: d ?? null }))}
                                  fromDate={tomorrowDate}
                                  // captionLayout="dropdown-buttons"
                                />
                              </div>
                            </div>
                          )}

                          {step === 2 && (
                            <div className="space-y-3">
                              <SectionTitle title="Choose a time" hint="Use the wheel pickers or quick slots" />
                              <div className="flex flex-col md:flex-row items-stretch gap-4">
                                <div className="flex items-center gap-3">
                                  <Wheel
                                    ariaLabel="Hour"
                                    values={hours}
                                    selected={state.time?.hour ?? 10}
                                    onSelect={(v) =>
                                      setState((s) => ({
                                        ...s,
                                        time: {
                                          hour: Number(v),
                                          minute: s.time?.minute ?? 0,
                                          period: s.time?.period ?? "AM",
                                        },
                                      }))
                                    }
                                  />
                                  <div className="text-2xl opacity-60">:</div>
                                  <Wheel
                                    ariaLabel="Minute"
                                    values={minutes.map((m) => (m + "").padStart(2, "0"))}
                                    selected={String(state.time?.minute ?? 0).padStart(2, "0")}
                                    onSelect={(v) =>
                                      setState((s) => ({
                                        ...s,
                                        time: {
                                          hour: s.time?.hour ?? 10,
                                          minute: Number(v),
                                          period: s.time?.period ?? "AM",
                                        },
                                      }))
                                    }
                                  />
                                  <Wheel
                                    ariaLabel="AM or PM"
                                    values={periods}
                                    selected={state.time?.period ?? "AM"}
                                    onSelect={(v) =>
                                      setState((s) => ({
                                        ...s,
                                        time: {
                                          hour: s.time?.hour ?? 10,
                                          minute: s.time?.minute ?? 0,
                                          period: v as "AM" | "PM",
                                        },
                                      }))
                                    }
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="grid grid-cols-3 gap-2">
                                    {quickSlots.map((q) => {
                                      const isSel =
                                        state.time?.hour === q.time.hour &&
                                        state.time?.minute === q.time.minute &&
                                        state.time?.period === q.time.period
                                      return (
                                        <button
                                          key={q.label}
                                          type="button"
                                          onClick={() => setState((s) => ({ ...s, time: q.time }))}
                                          className={cn(
                                            "rounded-lg border px-3 py-2 text-sm",
                                            isSel
                                              ? "border-primary bg-primary text-primary-foreground"
                                              : "hover:bg-accent",
                                          )}
                                        >
                                          {q.label}
                                        </button>
                                      )
                                    })}
                                  </div>
                                  <div className="mt-3 text-sm text-muted-foreground">
                                    Selected:{" "}
                                    <span className="font-medium">
                                      {`${state.time?.hour ?? 10}:${String(state.time?.minute ?? 0).padStart(
                                        2,
                                        "0",
                                      )} ${state.time?.period ?? "AM"}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {step === 3 && (
                            <div className="space-y-3">
                              <SectionTitle title="Per person budget" hint="Includes venue + food" />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {(["₹700-₹1000", "₹1000-₹1250", "₹2000+"] as BudgetTier[]).map((b, idx) => {
                                  const isSel = state.budget === b
                                  return (
                                    <button
                                      key={b}
                                      type="button"
                                      onClick={() => setState((s) => ({ ...s, budget: b }))}
                                      className={cn(
                                        "relative rounded-xl border p-4 text-left transition",
                                        "hover:scale-[1.01] active:scale-[0.99]",
                                        isSel ? "border-primary" : "border-border",
                                      )}
                                      style={{
                                        background:
                                          idx === 0
                                            ? "linear-gradient(135deg, var(--color-chart-2), var(--color-chart-3))"
                                            : idx === 1
                                              ? "linear-gradient(135deg, var(--color-chart-1), var(--color-chart-5))"
                                              : "linear-gradient(135deg, var(--color-chart-4), var(--color-chart-2))",
                                        color: "var(--color-primary-foreground)",
                                      }}
                                    >
                                      <div className="text-sm opacity-85">Tier {idx + 1}</div>
                                      <div className="text-xl font-semibold">{budgetLabel(b)}</div>
                                      <motion.div
                                        aria-hidden
                                        initial={false}
                                        animate={{
                                          boxShadow: isSel ? "0 0 32px 2px rgba(0,0,0,0.15)" : "0 0 0 0 transparent",
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="absolute inset-0 rounded-xl"
                                        style={{ pointerEvents: "none" }}
                                      />
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {step === 4 && (
                            <div className="space-y-4">
                              <SectionTitle title="How many guests?" hint="Drag the slider. Range: 20–1000" />
                              {/* Updated code */}
                              <div className="rounded-xl border bg-muted/30 p-4" style={{ backgroundColor: "#f0f0f0" }}>
                                <div className="flex items-center justify-between">
                                  <div className="text-2xl font-semibold">{state.guests ?? 100}</div>
                                  <div className="text-2xl" aria-hidden>
                                    {guestEmoji(state.guests ?? 100)}
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <Slider
                                    defaultValue={[100]}
                                    min={20}
                                    max={1000}
                                    step={10}
                                    value={[state.guests ?? 100]}
                                    onValueChange={(v) => setState((s) => ({ ...s, guests: v[0] }))}
                                  />
                                </div>
                                <div className="mt-3 text-sm text-muted-foreground">
                                  We can accommodate both intimate and grand celebrations.
                                </div>
                              </div>
                            </div>
                          )}

                          {step === 5 && (
                            <div className="space-y-4">
                              <SectionTitle
                                title="Your contact details"
                                hint="We’ll reach out to confirm the finer details."
                              />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Floating label pattern */}
                                <div className="relative">
                                  <Input
                                    id="name"
                                    placeholder=" "
                                    value={state.contact?.name ?? ""}
                                    onChange={(e) =>
                                      setState((s) => ({
                                        ...s,
                                        contact: { ...(s.contact ?? { phone: "", email: "" }), name: e.target.value },
                                      }))
                                    }
                                  />
                                  <label
                                    htmlFor="name"
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-background px-1 text-muted-foreground transition-all peer-focus:-top-2 peer-focus:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base"
                                  >
                                    Name
                                  </label>
                                </div>
                                <div className="relative">
                                  <Input
                                    id="phone"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder=" "
                                    value={state.contact?.phone ?? ""}
                                    onChange={(e) => {
                                      const onlyNums = e.target.value.replace(/\D+/g, "")
                                      setState((s) => ({
                                        ...s,
                                        contact: { ...(s.contact ?? { name: "", email: "" }), phone: onlyNums },
                                      }))
                                    }}
                                  />
                                  <label
                                    htmlFor="phone"
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-background px-1 text-muted-foreground transition-all peer-focus:-top-2 peer-focus:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base"
                                  >
                                    Phone
                                  </label>
                                </div>
                                <div className="relative">
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder=" "
                                    value={state.contact?.email ?? ""}
                                    onChange={(e) =>
                                      setState((s) => ({
                                        ...s,
                                        contact: { ...(s.contact ?? { name: "", phone: "" }), email: e.target.value },
                                      }))
                                    }
                                  />
                                  <label
                                    htmlFor="email"
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-background px-1 text-muted-foreground transition-all peer-focus:-top-2 peer-focus:text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base"
                                  >
                                    Email
                                  </label>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Tip: If you’ve booked before on this device, fields may autofill.
                              </p>
                            </div>
                          )}

                          {step === 6 && (
                            <div className="space-y-4">
                              <SectionTitle
                                title="Review your booking"
                                hint="Make sure everything looks good before confirming."
                              />
                              {/* Updated code */}
                              <div
                                className="rounded-xl border bg-muted/30 p-4 grid grid-cols-1 gap-3"
                                style={{ backgroundColor: "#f0f0f0" }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Event</span>
                                  <span className="font-medium">
                                    {state.eventType === "Other" ? state.otherEventText || "Other" : state.eventType}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Date</span>
                                   <span className="font-medium">
  {state.date ? new Date(state.date).toLocaleDateString() : "—"}
</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Time</span>
                                  <span className="font-medium">
                                    {state.time
                                      ? `${state.time.hour}:${String(state.time.minute).padStart(2, "0")} ${state.time.period}`
                                      : "—"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Budget</span>
                                  <span className="font-medium">{state.budget ? budgetLabel(state.budget) : "—"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Guests</span>
                                  <span className="font-medium">{state.guests ?? "—"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Contact</span>
                                  <span className="font-medium">
                                    {state.contact?.name} · {state.contact?.phone} · {state.contact?.email}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-end">
                                <Button onClick={confirmBooking}>Confirm Booking</Button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {!submitted && (
                    <div className="mt-6 flex items-center justify-between">
                      <Button variant="secondary" onClick={handleBack} disabled={step === 0}>
                        Back
                      </Button>
                      <div className="flex items-center gap-3">
                        {step === totalSteps - 1 ? (
                          <Button onClick={confirmBooking}>Confirm</Button>
                        ) : (
                          <Button onClick={handleNext} disabled={!canProceed()}>
                            Next
                          </Button>
                        )}
                        <Button variant="ghost" onClick={close}>
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
