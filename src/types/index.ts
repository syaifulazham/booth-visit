import { Admin, Booth, Visitor, Visit } from '@prisma/client'

export type { Admin, Booth, Visitor, Visit }

export interface BoothWithVisitCount extends Booth {
  _count?: {
    visits: number
  }
}

export interface VisitorWithVisitCount extends Visitor {
  _count?: {
    visits: number
  }
}

export interface VisitWithRelations extends Visit {
  visitor: Visitor
  booth: Booth
}

export interface DashboardStats {
  totalVisitors: number
  totalBooths: number
  totalVisits: number
  topBooths: BoothWithVisitCount[]
  recentVisits: VisitWithRelations[]
}

export interface DemographicStats {
  genderDistribution: { gender: string; count: number }[]
  visitorTypeDistribution: { type: string; count: number }[]
  sektorDistribution: { sektor: string; count: number }[]
  ageDistribution: { ageGroup: string; count: number }[]
}

export interface TimelineData {
  timestamp: string
  count: number
}
