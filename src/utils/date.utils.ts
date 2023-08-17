import { format } from 'date-fns'

export function getViewDateFormat(date: Date): string {
  return format(new Date(date), 'dd-MM-yyyy')
}

export function getOnboardingDateFormat(date: Date): string {
  return format(new Date(date), 'yyyy-MM-dd')
}

export function getViewDateAndTime(dateTime: Date): string {
  return format(new Date(dateTime), "dd-MM-yyyy HH:MM:SS aaaaa'm'")
}
