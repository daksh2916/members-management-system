import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  createEvent(@Body() data: any) {
    return this.eventsService.createEvent(data);
  }

  @Get()
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Get('current')
  getCurrentEvents() {
    return this.eventsService.getCurrentEvents();
  }

  @Get('upcoming')
  getUpcomingEvents() {
    return this.eventsService.getUpcomingEvents();
  }

  @Post(':eventId/add-member/:memberId')
  addMemberToEvent(@Param('eventId') eventId: string, @Param('memberId') memberId: string) {
    return this.eventsService.addMemberToEvent(eventId, memberId);
  }

  @Get(':eventId')
  getEvent(@Param('eventId') eventId: string) {
    return this.eventsService.getEventById(eventId);
  }
}
