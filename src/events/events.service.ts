import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  // Create a new event
  async createEvent(data: {
    name: string;
    description?: string;
    location: string;
    date: Date;
    totalSlots: number;
  }) {
    return this.prisma.event.create({ data });
  }

  // List all events
  async getAllEvents() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async getCurrentEvents() {
    const now = new Date();
    return this.prisma.event.findMany({
      where: { date: { lte: now } },
      orderBy: { date: 'asc' },
    });
  }

  // List upcoming events only
  async getUpcomingEvents() {
    const now = new Date();
    return this.prisma.event.findMany({
      where: { date: { gte: now } },
      orderBy: { date: 'asc' },
    });
  }

  // Register a member to an event
  async addMemberToEvent(eventId: string, memberId: string) {
    // Optional: check if slots are available
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { members: true },
    });

    const existing = await this.prisma.memberEvent.findUnique({
      where: { memberId_eventId: { memberId, eventId } },
    });
    
    if (existing) throw new Error('Member already registered');

    if (!event) throw new Error('Event not found');

    if (event.members.length >= event.totalSlots) {
      throw new Error('No slots available');
    }

    return this.prisma.memberEvent.create({
      data: { eventId, memberId },
    });
  }

  // Get event details
  async getEventById(eventId: string) {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: { members: { include: { member: true } } },
    });
  }
}
